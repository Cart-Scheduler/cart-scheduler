import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  // TÄRKEÄÄ: Määritellään, mihin kansioon valmiit tiedostot rakennetaan.
  // Vanha CRA käytti 'build' -kansiota, joten säilytetään se Firebasea varten.
  build: {
    outDir: 'build',
  },

  // MÄÄRITTELE ENV-MUUTTUJIEN ALKULOHKO
  // Vite käyttää oletuksena VITE_, mutta voit määrittää sen täällä
  envPrefix: 'VITE_',

  // OPTIONAALINEN: Konfiguraatio SPA-tilalle ja vanhalle koodille
  // base: '/', // Oletus: sovellus toimii juuripolussa

  // OPTIONAALINEN: Jos tarvitset aliaksia (esim. '@components/'), voit lisätä ne:
  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, 'src'),
  //   },
  // },
});
