import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mentions légales & CGV',
  description: 'Conditions générales de vente, mentions légales et politique de confidentialité.',
};

export default function LegalPage() {
  return (
    <div className="container prose prose-lg max-w-4xl py-16 dark:prose-invert">
      <h1>Mentions légales & conditions</h1>
      <h2 id="mentions">Mentions légales</h2>
      <p>
        Senior Zen est édité par la société BienVieillir SAS – 10 rue des Lilas 75000 Paris – SIRET 900 000 000 00000 –
        contact@seniorzen.fr.
      </p>
      <h2 id="cgv">Conditions générales de vente</h2>
      <p>
        Les ebooks sont des biens numériques livrés immédiatement. Conformément à la réglementation, le droit de
        rétractation ne s’applique pas après téléchargement. Le paiement est réalisé via Stripe. Les prix affichés
        comprennent la TVA applicable selon votre pays de résidence.
      </p>
      <h2 id="privacy">Politique de confidentialité</h2>
      <p>
        Les données personnelles collectées (email, nom, historique d’achats) sont utilisées pour fournir les services
        d’achat et d’accès aux ebooks. Elles sont hébergées sur notre base de données Postgres (Neon) et ne sont jamais
        revendues.
      </p>
      <p>
        Vous pouvez à tout moment demander la suppression de votre compte en écrivant à privacy@seniorzen.fr. Nous
        supprimons alors vos données et coupons associés sous 30 jours.
      </p>
    </div>
  );
}
