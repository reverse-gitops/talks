// Fonts are bundled so the deck also works without internet on stage.
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/600.css';
import './styles/base.css';

import slides from './slides/index.js';
import { Deck } from './deck.js';

const deck = new Deck(document.getElementById('stage'), slides);
deck.start();
window.deck = deck; // handy in the console: deck.show(3)
