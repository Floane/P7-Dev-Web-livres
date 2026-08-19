# Mon Vieux Grimoire - API de notation de livres

API REST sécurisée d'un site de référencement et de notation de livres. Elle gère les comptes utilisateurs, la publication de livres avec image de couverture, et un système de notation qui calcule et met à jour la note moyenne de chaque ouvrage. C'est mon projet le plus tourné back-end : l'occasion de travailler l'authentification, la sécurité des données et l'optimisation des images côté serveur.
 
> Projet réalisé dans le cadre de ma formation de développeuse front-end chez OpenClassrooms (projet « Développez le back-end d'un site de notation de livre »). Le front-end est fourni par OpenClassrooms et se lance en parallèle.

## Ce que j'ai développé
 
- **API REST complète** pour les livres : création, lecture, modification, suppression, avec contrôle des droits (seul le propriétaire modifie ou supprime son livre)
- **Authentification sécurisée** : inscription et connexion via JSON Web Token, mots de passe chiffrés avec bcrypt
- **Système de notation** : chaque utilisateur note un livre une seule fois, la note moyenne est recalculée à chaque nouvel avis
- **Endpoint « meilleures notes »** renvoyant les trois livres les mieux notés
- **Optimisation des images** à l'upload (redimensionnement et compression au format WebP côté serveur), pour alléger le stockage et les temps de chargement
- **Modélisation des données** avec Mongoose et validation des entrées

## Stack
 
Node.js, Express, MongoDB (Mongoose), JSON Web Token, bcrypt, Multer et Sharp pour la gestion des images.
