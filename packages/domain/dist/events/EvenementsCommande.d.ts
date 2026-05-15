export type CommandeCreee = {
    type: "CommandeCreee";
    commandeId: string;
    clientId: string;
    restaurantId: string;
    date: Date;
};
export type CommandePayee = {
    type: "CommandePayee";
    commandeId: string;
    factureId: string;
    date: Date;
};
export type CommandeAcceptee = {
    type: "CommandeAcceptee";
    commandeId: string;
    restaurantId: string;
    tempsPreparationMinutes: number;
    date: Date;
};
export type CommandeRefusee = {
    type: "CommandeRefusee";
    commandeId: string;
    restaurantId: string;
    date: Date;
};
export type CommandePrete = {
    type: "CommandePrete";
    commandeId: string;
    date: Date;
};
export type CommandeLivree = {
    type: "CommandeLivree";
    commandeId: string;
    livreurId: string;
    date: Date;
};
export type EvenementCommande = CommandeCreee | CommandePayee | CommandeAcceptee | CommandeRefusee | CommandePrete | CommandeLivree;