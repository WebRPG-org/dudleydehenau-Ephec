class ParkingManagementSystem:
    def __init__(self):
        self.ticket_counter = 1
        self.parking_spaces = {
            1: {"available": 50, "reserved": 0},
            2: {"available": 50, "reserved": 0},
            3: {"available": 50, "reserved": 0},
            4: {"available": 50, "reserved": 0}
        }
        self.handicap_spaces = {
            1: {"available": 2, "reserved": 0},
            2: {"available": 2, "reserved": 0},
            3: {"available": 2, "reserved": 0},
            4: {"available": 2, "reserved": 0}
        }

    def generate_ticket(self, floor, is_handicap=False) -> int:
        if self.parking_spaces[floor]["available"] > 0:
            ticket_number = self.ticket_counter
            self.ticket_counter += 1
            self.parking_spaces[floor]["available"] -= 1
            self.parking_spaces[floor]["reserved"] += 1

            if is_handicap:
                self.handicap_spaces[floor]["reserved"] += 1
                self.handicap_spaces[floor]["available"] -= 1

            return ticket_number
        else:
            return None

    def handle_exception(self, floor, exception_type):
        if exception_type == "free":
            # Suite a faire
            pass
        elif exception_type == "other":
            #Suite a faire
            pass
    
    def liberer_place(self, floor, is_handicap=False):
        if is_handicap:
            self.handicap_spaces[floor]["reserved"] -= 1
            self.handicap_spaces[floor]["available"] += 1
        else:
            self.parking_spaces[floor]["available"] += 1
            self.parking_spaces[floor]["reserved"] -= 1

    def show_stat_place(self):
        print("\nStatut des places dans chaque étage:")
        for floor, spaces in self.parking_spaces.items():
            reserved_spaces = spaces["reserved"] 
            available_spaces = spaces["available"]
            print(f"Étage {floor}: {reserved_spaces} places réservées, {available_spaces} places libres")


# Interface utilisateur en mode console
def console_interface():
    parking_system = ParkingManagementSystem()
    while True:
        print("\nMenu:")
        print("1. Générer un ticket")
        print("2. Gérer les exceptions")
        print("3. Afficher les places disponibles")
        print("4. Libérer une place")
        print("99. Quitter")
        choice = input("Choisissez une option: ")

        if choice == "1":
            floor = int(input("Entrez l'étage (1-4) : "))
            is_handicap = input("La place est-elle réservée aux personnes handicapées? (Oui/Non): ").lower() == "oui"
            ticket_number = parking_system.generate_ticket(floor, is_handicap)
            if ticket_number:
                print(f"Ticket généré avec succès. Numéro de ticket : {ticket_number}")
            else:
                print("Désolé, toutes les places sont occupées.")
        elif choice == "2":
            floor = int(input("Entrez l'étage (1-4) : "))
            exception_type = input("Type d'exception (gratuite/autre): ").lower()
            parking_system.handle_exception(floor, exception_type)
            print(f"Exception gérée avec succès à l'étage {floor}.")
        elif choice == "3":
            parking_system.show_stat_place()
        elif choice == "4":
            floor = int(input("Entrez l'étage (1-4) : "))
            is_handicap = input("La place était-elle réservée aux personnes handicapées? (Oui/Non): ").lower() == "oui"
            parking_system.liberer_place(floor, is_handicap)
            print(f"La place de l'étage {floor} a été libérée avec succès.")
        elif choice == "99":
            break
        else:
            print("Option invalide. Veuillez réessayer.")


if __name__ == "__main__":
    console_interface()
