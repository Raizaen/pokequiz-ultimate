# Administration sécurisée

PokéQuiz Ultimate reste accessible sans compte pour les joueurs. Seuls les membres
de la table protégée `admin_users` peuvent modifier la banque partagée.

## Configuration initiale

1. Exécuter `supabase/migrations/001_admin_access.sql` dans le SQL Editor Supabase.
2. Dans Authentication > URL Configuration :
   - Site URL : `https://pokequiz-ultimate.vercel.app`
   - Redirect URLs : ajouter `http://localhost:5173/**` et
     `https://pokequiz-ultimate.vercel.app/**`.
3. Dans Authentication > Users, inviter l’adresse administrateur.
4. Après acceptation de l’invitation, exécuter une seule fois dans le SQL Editor :

```sql
insert into public.admin_users (user_id)
select id
from auth.users
where email = 'ADRESSE_ADMINISTRATEUR'
on conflict (user_id) do nothing;
```

5. Ajouter `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY` aux variables
   d’environnement Vercel, pour Production, Preview et Development.

La clé secrète/service role et le mot de passe de la base ne doivent jamais être
placés dans le navigateur, le dépôt Git ou les variables commençant par `VITE_`.

## Journal des parties

Exécuter `supabase/migrations/003_game_analytics.sql` dans le SQL Editor.

Cette migration autorise les joueurs anonymes à enregistrer uniquement une partie
terminée. La lecture des résultats, des noms de joueurs et des statistiques reste
réservée aux membres de `admin_users`. Le quiz continue de fonctionner normalement
si Supabase est indisponible.

## Workflow éditorial et historique

Après la migration initiale, exécuter
`supabase/migrations/002_editorial_workflow.sql` dans le SQL Editor. Elle ajoute :

- les états À vérifier, Validée et Contestée ;
- l’obligation d’une source avant publication ;
- une révision automatique avant chaque modification ou suppression ;
- une fonction de restauration réservée aux administrateurs.
