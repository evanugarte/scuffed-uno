<script>
export default {
  name: "Stats",
  components: {},
  data() {
    return {};
  },
};
</script>

<template>
  <section class="stats">
    <a
      class="watermark"
      href="https://freddienelson.co.uk"
      rel="noopener"
      target="_blank"
    >
      made by <span>Freddie</span>
    </a>

    <router-link class="watermark stats-link" to="/">
      Back to Home
    </router-link>

    <header class="header">
      <img class="logo" src="@/assets/logo.png" alt="Scuffed Uno" />
      <h1 class="title">Stats</h1>
    </header>
  </section>
</template>

<style lang="scss" scoped>
$mobile: 900px;

.watermark {
  color: white;
  opacity: 0.5;
  font-size: clamp(1rem, 2vw, 1.3rem);
  position: absolute;
  bottom: 1.5vh;
  right: 1.1vw;
  font-weight: bold;

  &.stats-link {
    left: 1.1vw;
    right: unset;
    text-decoration: underline;
  }

  span {
    text-decoration: underline;
  }
}

img {
  user-select: none;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
  user-drag: none;
}

.stats {
  width: 100%;
  height: 100%;
  color: white;
  display: flex;
  flex-direction: column;

  .header {
    width: 100%;
    height: MIN(18%, 120px);
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;

    .logo {
      margin-left: 10px;
      width: auto;
      height: 100%;
      user-select: none;
      -webkit-user-drag: none;
      transform: scale(0.9);

      &.back {
        cursor: pointer;
      }
    }

    .title {
      margin-left: clamp(5px, 2vw, 20px);
      font-size: clamp(1.7rem, 4vw, 2.5rem);
      font-weight: bold;
    }
  }
}
</style>