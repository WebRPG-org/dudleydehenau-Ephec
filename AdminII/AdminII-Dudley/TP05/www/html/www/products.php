<html>
<style>
   table,
   th,
   td {
     padding: 10px;
     border: 1px solid black;
     border-collapse: collapse;
  }
</style>

<head>
<title>Catalogue WoodyToys</title>
</head>

<body>
<h1>Catalogue WoodyToys</h1>

<?php
// Paramètres de connexion à la base de données
$dbname = 'woodytoys';        // Nom de la base de données
$dbuser = 'root';             // Utilisateur
$dbpass = 'MotDePasseNul';           // Mot de passe
$dbhost = 'mariadb';          // Nom du service de la base de données dans Docker

// Connexion à la base de données
$connect = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname) 
    or die("Unable to connect to '$dbhost'");

// Requête pour récupérer les produits
$result = mysqli_query($connect, "SELECT id, product_name, product_price FROM products");

?>

<!-- Tableau pour afficher les produits -->
<table>
<tr>
 <th>Numéro de produit</th>
 <th>Descriptif</th>
 <th>Prix</th>
</tr>

<?php
// Affichage des produits dans le tableau
while ($row = mysqli_fetch_array($result)) {
    printf("<tr><td>%s</td><td>%s</td><td>%s</td></tr>", $row[0], $row[1], $row[2]);
}
?>

</table>
</body>
</html>
