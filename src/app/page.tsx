import React from "react";

type NavItem = {
  label: string;
};

type QuickItem = {
  title: string;
  icon: string;
};

type NewsItem = {
  date: string;
  title: string;
  desc: string;
};

type AgendaItem = {
  date: string;
  title: string;
  desc: string;
};

const navItems: NavItem[] = [
  { label: "VIE MUNICIPALE" },
  { label: "VIVRE À LEYCHERT" },
  { label: "PATRIMOINE" },
  { label: "SERVICES" },
];

const quickItems: QuickItem[] = [
  { title: "Mes Démarches", icon: "📄" },
  { title: "Numéros Utiles", icon: "☎️" },
  { title: "Associations", icon: "👥" },
  { title: "Portail Famille", icon: "🏠" },
  { title: "Publications Légales", icon: "📰" },
];

const newsItems: NewsItem[] = [
  {
    date: "Publié le 6 mai 2025",
    title: "Travaux sur la voirie communale",
    desc: "Des travaux de réfection auront lieu sur certaines voies afin d’améliorer la sécurité et la circulation.",
  },
  {
    date: "Publié le 3 mai 2025",
    title: "Soirée contée à la salle des fêtes",
    desc: "Petits et grands sont invités à une soirée conviviale autour des légendes et des histoires locales.",
  },
  {
    date: "Publié le 24 avril 2025",
    title: "Distribution de composteurs",
    desc: "La communauté de communes organise une distribution gratuite de composteurs pour les habitants.",
  },
];

const agendaItems: AgendaItem[] = [
  {
    date: "Dimanche 25 mai 2025",
    title: "Fête du village - Édition 2025",
    desc: "Repas champêtre, concert et animations pour célébrer l’été ensemble.",
  },
  {
    date: "Dimanche 15 juin 2025",
    title: "Randonnée découverte",
    desc: "Sortie accompagnée pour découvrir les sentiers et les paysages environnants.",
  },
];

export default function LandingPage() {
  return <div>
    <main className="mx-auto max-w-[1350px] overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
        <header className="relative min-h-[760px] bg-[linear-gradient(180deg,rgba(10,18,36,0.18),rgba(10,18,36,0.18)),radial-gradient(circle_at_85%_15%,rgba(255,186,0,0.55),transparent_22%),linear-gradient(180deg,#2c4b79_0%,#5f6f8e_18%,#9fb1c8_34%,#d7b27f_56%,#f7a63a_74%,#ffefb5_100%)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.08),transparent_25%),radial-gradient(circle_at_20%_40%,rgba(0,0,0,0.18),transparent_35%),linear-gradient(to_bottom,rgba(0,0,0,0.12),rgba(0,0,0,0.25))]" />

          <div className="relative z-10 px-8 pt-6">
            <div className="flex items-center justify-between gap-6 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/90 text-2xl text-[#d47a00]">
                  ☀️
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-white/80">
                    Commune de
                  </div>
                  <div className="font-serif text-2xl italic font-bold">
                    Leychert
                  </div>
                </div>
              </div>

              <nav className="hidden gap-10 text-sm font-medium uppercase tracking-[0.16em] lg:flex">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href="#"
                    className="transition hover:text-yellow-200"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            <section className="flex min-h-[620px] flex-col items-center justify-center text-center text-white">
              <p className="mb-3 text-sm uppercase tracking-[0.35em] text-white/80">
                Ariège Pyrénées
              </p>
              <h1 className="font-serif text-7xl italic font-bold drop-shadow-[0_4px_18px_rgba(0,0,0,0.35)] md:text-8xl">
                Leychert
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-white/90 md:text-xl">
                Entre montagne et tradition, bienvenue à Leychert.
              </p>

              <div className="mt-6 flex items-center gap-4">
                {["🔍", "✉️", "📞"].map((icon) => (
                  <button
                    key={icon}
                    className="grid h-11 w-11 place-items-center rounded-full bg-[#d84c42] text-lg text-white shadow-lg shadow-black/20 transition hover:scale-105"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="absolute bottom-0 left-0 right-0 z-20 h-32 bg-[linear-gradient(180deg,transparent_0%,transparent_40%,#fff_40%,#fff_100%)]">
            <div className="absolute left-0 right-0 top-2 h-16 bg-[#e4b03f] [clip-path:polygon(0_45%,8%_65%,18%_82%,30%_74%,40%_84%,52%_72%,66%_86%,78%_72%,90%_80%,100%_60%,100%_100%,0_100%)]" />
            <div className="relative mx-auto flex max-w-6xl -translate-y-6 items-start justify-between gap-4 px-6">
              {quickItems.map((item) => (
                <div key={item.title} className="flex flex-col items-center">
                  <div className="grid h-20 w-20 place-items-center rounded-full border border-[#ece7e1] bg-white text-3xl shadow-[0_10px_25px_rgba(0,0,0,0.08)]">
                    {item.icon}
                  </div>
                  <p className="mt-3 text-center text-sm font-medium text-slate-700">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </header>

        <section className="px-8 py-24">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <h2 className="font-serif text-5xl italic font-bold text-slate-900">
                Actualités
              </h2>
              <div className="mt-3 h-2 w-28 rounded-full bg-[#f2d28c]" />
            </div>
            <button className="rounded-full bg-[#173559] px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white">
              Toute l&apos;actualité
            </button>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.95fr]">
            <article className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(145deg,#d7c08f,#bfa46a)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
              <div className="h-[430px] rounded-[24px] bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(0,0,0,0.18)),linear-gradient(135deg,#d4c08b_0%,#b59c61_24%,#f7e7b0_48%,#89a35b_75%,#5d7b3b_100%)]" />
              <div className="absolute bottom-10 left-10 max-w-md rounded-[18px] bg-white p-6 shadow-xl">
                <span className="inline-flex rounded-full bg-[#b84b3b] px-3 py-1 text-xs font-semibold text-white">
                  Publié le 1 mai 2025
                </span>
                <h3 className="mt-4 text-xl font-semibold text-slate-900">
                  Un nouveau sentier balisé au départ de Leychert
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Le circuit “Sur les hauteurs de Leychert” est désormais accessible pour les promeneurs.
                </p>
                <a href="#" className="mt-4 inline-block text-sm font-semibold text-[#b84b3b]">
                  Lire la suite
                </a>
              </div>
            </article>

            <div className="space-y-8">
              {newsItems.map((item) => (
                <div key={item.title} className="border-t border-[#d8b0a8] pt-5">
                  <span className="inline-flex rounded-full bg-[#b84b3b] px-3 py-1 text-xs font-semibold text-white">
                    {item.date}
                  </span>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">
                    {item.desc}
                  </p>
                  <a href="#" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#b84b3b]">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-[#b84b3b] text-[11px] text-white">
                      →
                    </span>
                    Lire la suite
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-8 pb-24">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <h2 className="font-serif text-5xl italic font-bold text-slate-900">
                Agenda
              </h2>
              <p className="mt-6 max-w-sm text-sm leading-7 text-slate-600">
                Tout au long de l’année, Leychert s’anime au rythme de ses événements : fêtes locales, balades, ateliers et rencontres conviviales.
              </p>
              <button className="mt-6 rounded-full bg-[#173559] px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white">
                Tous les événements
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {agendaItems.map((item, index) => (
                <div
                  key={item.title}
                  className={`overflow-hidden rounded-[24px] bg-white shadow-[0_18px_50px_rgba(0,0,0,0.08)] ${
                    index === 0 ? "mt-14" : ""
                  }`}
                >
                  <div className="h-56 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.18)),linear-gradient(135deg,#5b3a25_0%,#8d6236_40%,#f2c36e_100%)]" />
                  <div className="p-6">
                    <span className="inline-flex rounded-full bg-[#f0c16d] px-3 py-1 text-xs font-semibold text-slate-900">
                      {item.date}
                    </span>
                    <h3 className="mt-4 text-xl font-semibold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.desc}
                    </p>
                    <a href="#" className="mt-4 inline-block text-sm font-semibold text-[#b0841d]">
                      Lire la suite
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden px-8 py-24">
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,33,50,0.35),rgba(20,33,50,0.15)),linear-gradient(135deg,#9db0cc_0%,#566c8a_30%,#20344d_70%,#11243a_100%)]" />
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_20%),radial-gradient(circle_at_70%_20%,rgba(255,214,122,0.55),transparent_16%)]" />

          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="text-white">
              <h2 className="font-serif text-5xl italic font-bold">
                Le territoire
              </h2>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/85">
                Petite commune nichée au pied de la montagne ariégeoise, Leychert séduit par son authenticité, son calme et son cadre naturel préservé.
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/85">
                Grâce à sa carte interactive, explorez les lieux emblématiques du village : mairie, sentiers, patrimoine local et services utiles.
              </p>
              <button className="mt-8 rounded-full bg-[#d84c42] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white">
                Voir la carte interactive
              </button>
            </div>

            <div className="relative flex justify-center">
              <div className="h-[420px] w-[380px] rounded-[40px] bg-[radial-gradient(circle_at_40%_30%,#19395f_0%,#102b49_60%,#0d223a_100%)] shadow-[0_25px_70px_rgba(0,0,0,0.35)] [clip-path:polygon(42%_0%,56%_4%,62%_10%,68%_18%,78%_24%,84%_36%,81%_46%,86%_58%,80%_67%,70%_74%,64%_82%,60%_92%,52%_100%,44%_96%,40%_88%,34%_82%,28%_76%,22%_70%,18%_60%,14%_50%,16%_38%,20%_28%,28%_18%,34%_8%)]" />
            </div>
          </div>
        </section>

        <footer className="grid gap-8 bg-white px-8 py-10 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#f6d37a] text-2xl">
              ☀️
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
                Commune de
              </div>
              <div className="font-serif text-3xl italic font-bold text-slate-900">
                Leychert
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-800">
              Mairie de Leychert
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              54 rue de la Source,
              <br />
              09200 Leychert
            </p>
            <p className="mt-3 text-sm text-slate-700">05 61 01 06 09</p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-800">
              Horaires d&apos;ouverture
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Le mardi et le mercredi de 13h à 19h
              <br />
              Le jeudi de 13h à 18h
            </p>
          </div>
        </footer>
      </main>
  </div>;
}