import { Injectable } from '@angular/core';
import { SupabaseAuthService } from './supabaseAuth.service';
import {last, Observable} from 'rxjs';
import { MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';

@Injectable({
  providedIn: 'root',
})
export class SupabaseCRUDService {
  private supabase;

  constructor(private authService: SupabaseAuthService) {
    this.supabase = authService['supabase']; // Accès au client Supabase depuis le service d'authentification
  }

  // Fonction getDataFromTable : - Permet de récupérer des données d'une table
  async getDataFromComponent(table: string, column: string) {
    const { data, error } = await this.supabase.from(table).select(column);

    if (error) {
      console.error('Erreur lors de la récupération des données :', error);
      return [];
    }
    return data || [];
  }

  // Méthode insertDataInTable : - Permet d'insérer des données dans la DB
  // async insertDataInTable(
  //   table: string,
  //   id: number,
  //   name: string,
  //   type_id: number,
  //   quantity: number,
  //   feature_id: number,
  //   compartment_id: number) {

  //     try {
  //       // Validation: `quantity` peut être nul, mais pas les autres champs
  //       // if (!table || !column || !id || !type_id || !feature_id || !compartment_id) {
  //       //   throw new Error('Tous les champs sauf "quantity" et "name" sont obligatoires.');
  //       // }

  //       const { data, error } = await this.supabase
  //         .from(table)
  //         .insert([
  //           {
  //             Id: id,
  //             Name: name,
  //             Type_id: type_id,
  //             Quantity: quantity,
  //             Feature_id: feature_id,
  //             Compartment_id: compartment_id
  //           },
  //         ]);

  //       if (error) {
  //         console.error('Erreur lors de l\'insertion:', error.message);
  //       } else {
  //         console.log('Données insérées avec succès:', data);
  //       }
  //     } catch (error) {
  //       console.error('Erreur:', error);
  //     }
  // }



  // méthodes qui permettent d'insérer des données dans la base de données

  async insertUser(firstName: string, lastName: string) {
    const userName = `${firstName[0]}. ${lastName}`;
    try {
      const { data, error } = await this.supabase
        .from('Host')
        .select('Id, First_name, Last_name')
        .order('Id', { ascending: false })
        .limit(1);

      if (error) throw error;

      const newId = data && data.length > 0 ? data[0].Id + 1 : 1;

      if (!firstName || !lastName) {
        throw new Error('Last Name and First Name required');
      }
      const { error: insertError } = await this.supabase.from('Host').insert([
        {
          Id: newId,
          Host_name: userName,
          First_name: firstName,
          Last_name: lastName,
        },
      ]);

      if (insertError) {
        console.error('Error while trying to create a new user');
      } else {
        console.log(`Sucessfully created user ${userName}`, data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async updateQuantity(idComponent: number, quantityComponent: number) {
    const { data, error } = await this.supabase
      .from('Component')
      .update({ Quantity: quantityComponent })
      .eq('Id', idComponent)
      .select();

    if (error) {
      console.error('Error updating quantity:', error);
      return null;
    }

    console.log('Updated component Quantity', data);
    return data;
  }

  async updateValue(idFeature: number, value: any) {
    const { data, error } = await this.supabase
      .from('Feature')
      .update({ Description: value })
      .eq('Id', idFeature)
      .select();

    if (error) {
      console.error('Error updating feature description:', error);
      return null;
    }

    console.log('Updated component Description', data);
    return data;
  }

  async updateComponent(id: number, quantity: number): Promise<any> {
    const currentQuantity = await this.getSpecifiedComponentQuantity(id);

    if (currentQuantity === null) {
      console.error(
        `Cannot retrieve quantity for component with Feature_id ${id}`
      );
      return null;
    }

    const newQuantity = currentQuantity + quantity;

    const { data, error } = await this.supabase
      .from('Component')
      .update({ Quantity: newQuantity })
      .eq('Feature_id', id)
      .select('*');

    if (error) {
      console.error('Error while trying to update component quantity:', error);
      return null;
    }

    console.log(
      `Updated component Feature_id ${id} to new quantity: ${newQuantity}`,
      data
    );
    return data;
  }

  async updateComponentRestock(id: number, restock: number) {
    const { data, error } = await this.supabase
      .from('Type')
      .update({ Restock_value: restock })
      .eq('Id', id)
      .select('*');

    if (error) {
      console.error(
        'Error while trying to update the restock value notification',
        error
      );
      return null;
    }

    console.log(`Updated component ${id} restock value`, data);
    return data;
  }


  async uploadImageToBucket(
    filePath: string,
    file: File | Blob,
    idFeature: number
  ){
    try {
      const { data, error } = await this.supabase.storage
        .from('component_images')
        .upload(filePath, file, { upsert: true });

      if (error) {
        throw error;
      }

      const publicUrl = this.supabase.storage
        .from('component_images')
        .getPublicUrl(filePath);

        if (!publicUrl) {
          throw new Error('Erreur pour générer une url publique');
        }

        if(idFeature < 0){
          const databaseUpload = await this.uploadImageToDatabase(idFeature, publicUrl.data.publicUrl);
          return databaseUpload;
        }

        const databaseUpload = await this.uploadImageToDatabase(idFeature, publicUrl.data.publicUrl);
        if (!databaseUpload) {
          throw new Error('Erreur pour mettre l\'url dans la base de donnée');
        }

      return {

        success: true,
      };
    } catch (error: any) {
      console.error('Error uploading image:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async uploadImageToDatabase(idFeature: number, imageUrl: any){
    if(idFeature >= 0){
      const{data, error} = await this.supabase
        .from('Feature')
        .update({Image: imageUrl})
        .eq('Id', idFeature)
        .select();

      if(error){
        console.error('Erreur pour mettre l\'image dans la base de donnée', error);
        return null;
      }

      console.log('L\'image à été mise dans la base de donnée');
      return data;
    }else{
      return imageUrl;
    }
  }



  async addFeature(newId: number, newDescription: string, newImage: string): Promise<any> {
    const { data, error } = await this.supabase
      .from('Feature')
      .insert([{ Id: newId,  Description: newDescription, Image: newImage }]);

    if (error) {
      console.error('Erreur pour ajouter la feature:', error);
      return null;
    }
    return data;
  }

  async addComponent(newId: number, newName: string, newTypeId: number, newQuantity: number, newFeatureId: number, newCompartement: number): Promise<any> {
    const { data, error } = await this.supabase
      .from('Component')
      .insert([{Id: newId, Name: newName, Type_id: newTypeId, Quantity: newQuantity, Feature_id: newFeatureId, Compartment_id :newCompartement }]);

    if (error) {
      console.error('Erreur pour ajouter le nouveau composant:', error);
      return null;
    }
    return data;
  }





  //méthodes qui permettent de récupérer des données dans la base de données

  async getComponentsWithDetails() {
    const { data, error } = await this.supabase.from('Component').select(`
        *,
        Feature (
          Description,
          Image,
          Id
        ),
        Type (
          Name,
          Id
        )
      `);

    if (error) {
      console.error('Error fetching components with details:', error);
      return [];
    }

    return data || [];
  }

  async getComponentQuantity() {
    const { data, error } = await this.supabase
      .from('Component')
      .select('Type_id, Quantity, Feature_id');

    if (error) {
      console.error('Error fetching components with details:', error);
      return [];
    }

    return data || [];
  }

  async getSpecifiedComponentQuantity(id: number): Promise<number | null> {
    const { data, error } = await this.supabase
      .from('Component')
      .select('Quantity')
      .eq('Feature_id', id)
      .single();

    if (error) {
      console.error(
        'Error fetching the quantity of the specified compoenent :',
        error
      );
      return null;
    }

    return data?.Quantity ?? null;
  }

  async getFeatureDescription(featureId: number) {
    const { data, error } = await this.supabase
      .from('Feature')
      .select('Description')
      .eq('Id', featureId)
      .single();
    if (error) {
      console.error(
        'Erreur pour récupérer les descriptions des composants : ',
        error
      );
      return null;
    }

    return data ? data.Description : null;
  }

  async getTypeComponent(typeId: number) {
    const { data, error } = await this.supabase
      .from('Type')
      .select('Name, Restock_value')
      .eq('Id', typeId)
      .single();
    if (error) {
      console.error('Error fetching type component:', error);
      return null;
    }

    return data;
  }

  async getTypeIdComponent() {
    const { data, error } = await this.supabase.from('Type').select('Id, Name');

    if (error) {
      console.error('Erreur récupération type des components :', error);
      return [];
    }
    return data;
  }

  async getUtilisateurs() {
    const { data, error } = await this.supabase
      .from('Host')
      .select('Host_name');

    if (error) {
      console.error('Erreur pour récupérer les utilisateurs :', error);
      return [];
    }

    return data || [];
  }

  async getType(){
    //permet de récupérer la liste (id et nom) de tous les types de composants qui existent dans la base de données
    const {data, error} = await this.supabase
      .from('Type')
      .select('Id, Name');

      if(error){
        console.error('Erreur pour récupérer les noms et id des types de composants : ', error);
        return [];
      }
      return data;
  }


  async getLatFeatureId(prefixId: number) {
    const { data, error } = await this.supabase
      .from('Feature')
      .select('Id');

    let lastId = prefixId * 100;

    if (data != null) {
      for (let i = 0; i < data.length; i++) {

        const idText = data[i].Id.toString();
        if (idText[0] === prefixId.toString()) {
          const idNumber = Number(idText)
          if(idNumber > lastId){
            lastId = idNumber;
          }
        }
      }
    }

    return lastId;
  }


  async getLastComponentId() {
    const {data, error} = await this.supabase
      .from('Component')
      .select('Id');

    let lastId = 0;
    if (data != null) {
      for (let i = 0; i < data.length; i++) {

        const id = data[i].Id;
        if(id > lastId){
            lastId = id;
        }
      }
    }

    return lastId;
  }



    //méthodes qui permettent de suprimer des données dans la base de données


    async deleteComponent(idComponent : number, idFeature : number){
      const{error} = await this.supabase
        .from('Component')
        .delete()
        .eq('Id', idComponent);

      if (error){
        console.error('Erreur pour supprimer le composant de la table Component ', error);


      }else{

        const{error} = await this.supabase
          .from('Feature')
          .delete()
          .eq('Id', idFeature);

          if (error){
            console.error('Erreur pour supprimer le composant de la table Feature ', error);
          }


      }

    }
    async getHistoric() {
      console.log('getHistoric');
      const {data, error} = await this.supabase.from('Historic').select('*')
      if (error) {
        console.error('Error fetching components with details:', error);
        return [];
      }
      return data || [];
    }
}

