import Vue from "vue";
import Vuex from "vuex";
import SoundController from "../api/sound.mjs";

Vue.use(Vuex);

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

const getIsLandscape = () => {
  try {
    return screen.orientation && screen.orientation.type
      ? screen.orientation.type.includes("landscape")
      : window.matchMedia("(orientation: landscape)").matches;
  } catch (err) {
    console.log(err);
    return true;
  }
};

const defaultRoom = {
  id: "",
  isHost: false,
  turn: "",
  pile: [],
  started: false,
  directionReversed: false,
  stack: 0,
  playerCount: 0,
  you: {},
  right: {},
  left: {},
  top: {},
  winner: {},
};

const store = new Vuex.Store({
  state: {
    isMobile,
    isConnected: false,
    isLandscape: getIsLandscape(),
    isOffline: !navigator.onLine,
    windowWidth: 1920,
    windowHeight: 1080,
    socket: null,
    animateCards: [],
    room: { ...defaultRoom },
    soundController: new SoundController(),
  },
  mutations: {
    SET_WINDOW_DIMENSIONS(state, { width, height }) {
      state.windowWidth = width;
      state.windowHeight = height;
    },

    SET_SOCKET(state, socket) {
      state.socket = socket;
    },
    SET_IS_CONNECTED(state, status) {
      state.isConnected = status;
    },
    SET_IS_OFFLINE(state, status) {
      state.isOffline = status;
    },
    SET_IS_LANDSCAPE(state, bool) {
      state.isLandscape = bool;
    },

    SET_ROOM(state, room) {
      state.room = room;
    },
    RESET_ROOM(state) {
      state.room = { ...defaultRoom };
    },

    ADD_ANIMATE_CARD(state, card) {
      state.animateCards = [...state.animateCards, card];
    },
    REMOVE_ANIMATE_CARD(state, index) {
      const cards = [...state.animateCards];
      cards.splice(index, 1);
      state.animateCards = cards;
    },
  },
});

// isOffline listeners
window.addEventListener("online", () => store.commit("SET_IS_OFFLINE", false));
window.addEventListener("offline", () => store.commit("SET_IS_OFFLINE", true));

// isLandscape listeners
if (screen.orientation)
  screen.orientation.onchange = () => store.commit("SET_IS_LANDSCAPE", getIsLandscape());

window.addEventListener("orientationchange", () => store.commit("SET_IS_LANDSCAPE", getIsLandscape()));
window.addEventListener("deviceorientation", () => store.commit("SET_IS_LANDSCAPE", getIsLandscape()));

const resizeObserver = new ResizeObserver(() => {
  store.commit("SET_WINDOW_DIMENSIONS", { width: window.innerWidth, height: window.innerHeight });
});

resizeObserver.observe(document.getElementsByTagName("html")[0]);

export default store;
