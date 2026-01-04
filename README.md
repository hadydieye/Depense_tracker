# Application de Gestion de Dépenses 💰

Une application web moderne de gestion de dépenses personnelles, inspirée de Revolut et N26, développée avec Next.js 16, React 19, TypeScript et Tailwind CSS v4.

## 📋 Table des matières

- [Fonctionnalités implémentées](#fonctionnalités-implémentées)
- [Technologies utilisées](#technologies-utilisées)
- [Structure du projet](#structure-du-projet)
- [Installation et démarrage](#installation-et-démarrage)
- [Utilisation](#utilisation)
- [Fonctionnalités à venir](#fonctionnalités-à-venir)
- [Spécifications techniques](#spécifications-techniques)

---

## ✅ Fonctionnalités implémentées

### 1. Tableau de bord (Dashboard)
- ✅ Vue d'ensemble des dépenses du mois en cours
- ✅ Affichage des dépenses par catégorie avec barres de progression
- ✅ Liste des 5 dépenses les plus récentes
- ✅ Indicateurs de budget avec pourcentage utilisé et montant restant
- ✅ Actions rapides vers Budgets et Analyses
- ✅ Design fintech moderne avec gradient sur la carte principale

### 2. Gestion des dépenses
- ✅ Ajout de dépenses avec montant, catégorie, date et note
- ✅ Modification des dépenses existantes
- ✅ Suppression de dépenses avec confirmation
- ✅ Support des dépenses récurrentes (daily, weekly, monthly, yearly)
- ✅ Filtrage par catégorie
- ✅ Filtrage par période (aujourd'hui, semaine, mois, année, personnalisé)
- ✅ Recherche par note
- ✅ Liste triée par date (plus récent en premier)
- ✅ Affichage avec icônes et couleurs par catégorie

### 3. Gestion des budgets
- ✅ Création de budgets par catégorie
- ✅ Budgets mensuels ou annuels
- ✅ Visualisation de la progression (pourcentage et montant)
- ✅ Alertes visuelles selon le niveau de consommation :
  - 🟢 Vert : 0-70% du budget
  - 🟡 Orange : 70-90% du budget
  - 🔴 Rouge : >90% du budget
- ✅ Suppression de budgets
- ✅ Modification de budgets existants

### 4. Analyses et statistiques
- ✅ Dépenses totales (aujourd'hui, semaine, mois, année)
- ✅ Moyenne quotidienne
- ✅ Graphique d'évolution des dépenses mensuelles (6 derniers mois)
- ✅ Répartition des dépenses par catégorie (graphique en barres)
- ✅ Top 3 des catégories les plus dépensières
- ✅ Statistiques en temps réel basées sur les données locales

### 5. Paramètres
- ✅ Gestion des catégories personnalisées
- ✅ Ajout de nouvelles catégories (nom, icône emoji, couleur)
- ✅ Suppression des catégories personnalisées (les catégories par défaut sont protégées)
- ✅ Réinitialisation des catégories aux valeurs par défaut
- ✅ Export des données en format CSV
- ✅ Interface de configuration intuitive
- ✅ Gestion des devises (Franc Guinéen, Euro, Dollar US)
- ✅ Conversion automatique des montants selon la devise sélectionnée
- ✅ Formatage adaptatif selon la devise (points/espaces pour milliers)

### 6. Design et UX
- ✅ Interface en français
- ✅ Design inspiré de Revolut et N26
- ✅ Navigation adaptative (bottom bar sur mobile, sidebar sur desktop)
- ✅ Responsive design (mobile-first)
- ✅ Thème fintech professionnel avec couleurs cohérentes
- ✅ Animations et transitions fluides
- ✅ Icônes Lucide pour une interface moderne
- ✅ Typography optimisée (Inter pour le texte, JetBrains Mono pour les chiffres)

### 7. Stockage et données
- ✅ Persistance des données via localStorage (navigateur)
- ✅ Pas de base de données externe requise
- ✅ Gestion d'état avec React hooks (useState, useEffect)
- ✅ Synchronisation automatique des données
- ✅ Export CSV pour sauvegarde externe

### 8. Notifications et alertes
- ✅ Notifications push pour alertes de budget (80% et 100%)
- ✅ Demandes de permission automatiques
- ✅ Notifications contextuelles avec icônes
- ✅ Gestion intelligente des cooldowns pour éviter le spam
- ✅ Support des notifications via l'API Notifications du navigateur

---

## 🚀 Technologies utilisées

### Frontend
- **Next.js 16** - Framework React avec App Router
- **React 19.2** - Bibliothèque UI avec les dernières fonctionnalités
- **TypeScript** - Typage statique pour plus de sécurité
- **Tailwind CSS v4** - Framework CSS utility-first moderne
- **shadcn/ui** - Composants UI réutilisables et accessibles

### Bibliothèques
- **Lucide React** - Icônes modernes et élégantes
- **date-fns** - Manipulation de dates (format, calculs)
- **Recharts** - Graphiques interactifs pour les analyses
- **SWR** (à venir) - Gestion du cache et de la synchronisation

### Design tokens
- Thème fintech personnalisé avec palette de couleurs professionnelle
- Variables CSS pour cohérence visuelle
- Support du dark mode (prêt à implémenter)

---

## 📁 Structure du projet

```
/
├── app/
│   ├── page.tsx                 # Dashboard (accueil)
│   ├── expenses/
│   │   └── page.tsx            # Page de gestion des dépenses
│   ├── budgets/
│   │   └── page.tsx            # Page de gestion des budgets
│   ├── analytics/
│   │   └── page.tsx            # Page d'analyses et statistiques
│   ├── settings/
│   │   └── page.tsx            # Page de paramètres
│   ├── layout.tsx              # Layout principal avec navigation
│   └── globals.css             # Styles globaux et tokens de design
│
├── components/
│   ├── navigation.tsx          # Navigation adaptative (sidebar + bottom bar)
│   ├── expense-form.tsx        # Formulaire d'ajout/modification de dépense
│   └── ui/                     # Composants shadcn/ui
│
├── lib/
│   ├── types.ts                # Types TypeScript (Expense, Budget, Category)
│   ├── storage.ts              # Fonctions de gestion du localStorage
│   └── analytics.ts            # Calculs et analyses de données
│
└── public/
  └── static/                 # Fichiers statiques et assets publics
```

---

## 🛠️ Installation et démarrage

### Option 1 : Déploiement sur Vercel (recommandé)
1. Cliquez sur le bouton "Publish" dans l'interface v0
2. Suivez les instructions pour déployer sur Vercel
3. Votre app sera accessible en ligne instantanément

### Option 2 : Installation locale
1. Téléchargez le projet (bouton "Download ZIP" dans v0)
2. Décompressez et ouvrez un terminal dans le dossier
3. Installez les dépendances :
```bash
npm install
```
4. Lancez le serveur de développement :
```bash
npm run dev
```
5. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur

---

## 📱 Utilisation

### Notifications de budget

L'application envoie automatiquement des notifications lorsque vos budgets atteignent certains seuils :
- **Alerte à 80%** : Vous êtes averti quand vous avez utilisé 80% de votre budget
- **Alerte critique à 100%** : Notification lorsque le budget est dépassé

Les notifications nécessitent votre autorisation lors de la première utilisation. Vous pouvez les gérer dans les paramètres de votre navigateur.

### Ajouter une dépense
1. Cliquez sur le bouton "+" en haut à droite
2. Remplissez le formulaire (montant, catégorie, date, note optionnelle)
3. Cochez "Dépense récurrente" si nécessaire et choisissez la fréquence
4. Cliquez sur "Ajouter la dépense"

### Créer un budget
1. Allez dans l'onglet "Budgets"
2. Cliquez sur "Ajouter un budget"
3. Sélectionnez une catégorie, définissez le montant et la période
4. Le budget apparaît avec une barre de progression

### Consulter les analyses
1. Allez dans l'onglet "Analyses"
2. Consultez le graphique d'évolution mensuelle
3. Visualisez la répartition par catégorie
4. Identifiez vos 3 catégories les plus dépensières

### Gérer les catégories
1. Allez dans "Paramètres"
2. Section "Gérer les catégories"
3. Ajoutez de nouvelles catégories avec icône emoji et couleur
4. Supprimez les catégories personnalisées (les 6 par défaut sont protégées)

### Exporter les données
1. Allez dans "Paramètres"
2. Cliquez sur "Exporter en CSV"
3. Un fichier CSV sera téléchargé avec toutes vos dépenses

---

## 🔮 Fonctionnalités à venir

### Priorité haute (Version complète du cahier des charges)
- ✅ **Mode sombre** (dark mode) - Implémenté
- ✅ **Notifications push** pour alertes de budget - Implémenté
- ✅ **Mode hors ligne (limité)** - Certaines fonctionnalités peuvent fonctionner hors ligne
- ⏳ **Authentification utilisateur** (si besoin d'une version multi-utilisateurs)
- ⏳ **Synchronisation cloud** avec Supabase ou autre base de données
- ⏳ **Partage de budgets** entre utilisateurs

### Priorité moyenne
- ⏳ **Graphiques avancés** (camembert, courbes de tendance)
- ⏳ **Prévisions de dépenses** basées sur l'historique
- ⏳ **Objectifs d'épargne** avec suivi
- ⏳ **Catégories hiérarchiques** (sous-catégories)
- ✅ **Devises multiples** avec taux de change - Implémenté
- ⏳ **Import de relevés bancaires** (CSV, OFX)

### Priorité basse
- ⏳ **Statistiques avancées** (médiane, écart-type)
- ⏳ **Comparaison entre périodes**
- ⏳ **Rapports PDF** personnalisés
- ⏳ **Assistant IA** pour conseils financiers
- ⏳ **Intégration Open Banking** (agrégation de comptes)

---

## 🔧 Spécifications techniques

### Catégories par défaut
L'application inclut 6 catégories prédéfinies :
- 🍔 **Alimentation** (vert #10b981)
- 🚗 **Transport** (bleu #3b82f6)
- 🎮 **Loisirs** (violet #8b5cf6)
- 🏥 **Santé** (rouge #ef4444)
- 🏠 **Logement** (orange #f59e0b)
- 📦 **Autres** (gris #6b7280)

### Stockage des données
Les données sont stockées dans le localStorage du navigateur sous forme de JSON :
- `expenses` : Tableau de toutes les dépenses
- `budgets` : Tableau de tous les budgets
- `categories` : Tableau de toutes les catégories (défaut + personnalisées)

**Note importante** : Les données sont locales au navigateur. Si vous changez de navigateur ou videz le cache, les données seront perdues. Utilisez l'export CSV pour sauvegarder vos données régulièrement.

### Format des données

#### Expense
```typescript
{
  id: string                    // UUID généré automatiquement
  amount: number                // Montant de la dépense
  category: string              // Nom de la catégorie
  date: string                  // Date au format ISO
  note?: string                 // Note optionnelle
  isRecurring?: boolean         // Dépense récurrente
  recurringFrequency?: string   // daily, weekly, monthly, yearly
  createdAt: string            // Date de création
  updatedAt: string            // Date de modification
}
```

#### Budget
```typescript
{
  id: string                    // UUID généré automatiquement
  category: string              // Nom de la catégorie
  amount: number                // Montant du budget
  period: string                // monthly ou yearly
  createdAt: string            // Date de création
  updatedAt: string            // Date de modification
}
```

#### Category
```typescript
{
  id: string                    // UUID généré automatiquement
  name: string                  // Nom de la catégorie
  icon: string                  // Emoji (ex: 🍔)
  color: string                 // Couleur hex (ex: #10b981)
  isDefault: boolean            // true pour catégories protégées
}
```

---

## 📊 État du projet

### MVP (Minimum Viable Product) : ✅ 100% complété

Toutes les fonctionnalités essentielles du MVP ont été implémentées :
- ✅ Ajout, modification, suppression de dépenses
- ✅ Système de catégories avec personnalisation
- ✅ Budgets par catégorie avec alertes
- ✅ Dashboard avec vue d'ensemble
- ✅ Analyses et statistiques détaillées
- ✅ Export CSV
- ✅ Interface responsive et moderne
- ✅ Stockage local fonctionnel

### Version complète : ✅ Fonctionnalités avancées implémentées

Les fonctionnalités prioritaires ont été ajoutées :
- ✅ **Mode sombre** - Support complet avec thème système
- ✅ **Notifications push** - Alertes automatiques pour les budgets (80% et 100%)
 - ✅ Architecture modulaire et extensible
 - ✅ Types TypeScript bien définis
 - ✅ Composants réutilisables
 - ✅ Séparation claire logique/présentation
 - ✅ Prêt pour intégration Supabase/Neon

---

## 🎨 Design et accessibilité

- Interface 100% en français
- Design responsive (mobile-first)
- Navigation intuitive adaptative
- Contraste WCAG AA conforme
- Support clavier complet
- Composants shadcn/ui accessibles (ARIA)
- Police lisible et hiérarchie typographique claire

---


**Développé par Artemis99 (Chef de projet) et scriptseinsei**

---

## 👥 Équipe de développement

- **Artemis99** - Chef de projet
- **scriptseinsei** - Développeur
