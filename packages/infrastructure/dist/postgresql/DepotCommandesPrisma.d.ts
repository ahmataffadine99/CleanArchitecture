import { PrismaClient } from "@prisma/client";
import { Commande } from "@ecoeats/domain";
import { DepotCommandes } from "@ecoeats/application";
export declare class DepotCommandesPrisma implements DepotCommandes {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    sauvegarder(commande: Commande): Promise<void>;
    trouverParId(id: string): Promise<Commande>;
    trouverParRestaurant(restaurantId: string): Promise<Commande[]>;
    trouverParClient(clientId: string): Promise<Commande[]>;
    trouverParLivreur(livreurId: string): Promise<Commande[]>;
    trouverTout(): Promise<Commande[]>;
    trouverCommandesSansLivreur(): Promise<Commande[]>;
    private reconstruire;
    /**
     * Retrouve la suite minimale de transitions pour passer de EN_ATTENTE au statut cible.
     * Respecte strictement la machine à états du Domain.
     */
    private retrouverTransitions;
}