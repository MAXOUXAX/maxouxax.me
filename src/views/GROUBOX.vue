<template>
  <div class="groubox">
    <v-card-text class="text--primary text-center"
      ><h1>GROUBOX</h1></v-card-text
    >
    <div class="button-div" id="centerdiv" data-sr-id="0">
      <span v-for="sound in sounds" v-bind:key="sound.id">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              raised
              rounded
              x-large
              :loading="sound.loading"
              @contextmenu.prevent="handleContext(sound)"
              v-on="on"
              v-bind="attrs"
              color="secondary"
              elevation="5"
              v-on:click="playSound(sound.id)"
              :id="sound.id"
              ><v-icon :large="sound.playing" left>{{
                sound.playing ? "mdi-stop" : "mdi-play"
              }}</v-icon
              >{{ sound.name }}</v-btn
            >
          </template>
          <span>
            <v-icon left>mdi-play</v-icon>
            Jouer
          </span>
        </v-tooltip>
      </span>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-size: 3rem;
  margin: 25px 0px 0px 0px;
}
.button-div {
  text-align: center;
  margin: 50px 25px 25px 25px;
}
.button-div span button {
  position: relative;
  display: inline-block;
  padding: 12px 36px;
  margin: 10px;
  color: #fff;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 40px;
  font-size: 18px;
  text-decoration: none;
  letter-spacing: 2px;
  overflow: hidden;
  border: none;
  transition: 0.3s ease;
  text-transform: uppercase;
  height: 80px;
  cursor: pointer;
}
.button-div span button:focus {
  outline: none;
}
.button-div span button:hover {
  box-shadow: 0 0 10px #2195f315, 0 0 40px #2196f315, 0 0 80px #2196f315;
}
.button-div span button span {
  position: absolute;
  background-color: #fff;
  transform: translate(-50%, -50%);
  pointer-events: none;
  border-radius: 50%;
  animation: animate 1s linear infinite;
}

@media screen and (max-width: 800px) {
  .button-div > button > span {
    display: none;
  }
}

@keyframes animate {
  0% {
    width: 0;
    height: 0;
    opacity: 0.2;
  }
  100% {
    width: 500px;
    height: 500px;
    opacity: 0;
  }
}
</style>

<script>
export default {
  methods: {
    playSound(name) {
      if (this.audio == null || (this.audio != null && this.audio.ended)) {
        let sound = this.sounds.filter((s) => {
          return s.id == name;
        });
        sound[0].playing = true;
        sound[0].loading = true;
        let temp = require("@/static/sounds/" + name + ".mp3");
        this.audio = new Audio(temp);
        this.audio.play();
        this.audio.addEventListener("ended", function () {
          sound[0].playing = false;
        });
        this.audio.addEventListener("canplaythrough", function () {
          sound[0].loading = false;
        });
      }
    },
    handleContext(sound) {
      if (this.audio != null) {
        var text = this.audio.src;
        text = text.replace(/^.*[\\\/]/, "");
        if (text.startsWith(sound.id)) {
          sound.playing = false;
          this.audio.currentTime = 0;
          this.audio.pause();
          this.audio = null;
        }
      }
    },
  },
  data() {
    return {
      sounds: [
        { id: "uuuu", name: "UUUUU", playing: false, loading: false },
        { id: "waaaee", name: "WAAAEEE", playing: false, loading: false },
        { id: "rali", name: "RALI RUGUR", playing: false, loading: false },
        {
          id: "ozbur",
          name: "OZBUR MUSTARFUX",
          playing: false,
          loading: false,
        },
        { id: "briboulux", name: "BRIBOULUX", playing: false, loading: false },
        {
          id: "smoke",
          name: "WAAAAEEEE SMOKE",
          playing: false,
          loading: false,
        },
        { id: "wow", name: "WOW", playing: false, loading: false },
        { id: "ehoh", name: "EH OH !", playing: false, loading: false },
        {
          id: "sachawae",
          name: "WAAAEE SARCHOUX",
          playing: false,
          loading: false,
        },
        {
          id: "ofcourse",
          name: "OF COURSE...",
          playing: false,
          loading: false,
        },
        {
          id: "baise",
          name: "BAIIISEEE TA MEERE",
          playing: false,
          loading: false,
        },
        {
          id: "logique",
          name: "Bah oe logique",
          playing: false,
          loading: false,
        },
        { id: "nique", name: "JVOUS NIQUE", playing: false, loading: false },
        {
          id: "sachauuu",
          name: "UUUUU SARCHOUX",
          playing: false,
          loading: false,
        },
        { id: "match", name: "MATCH !", playing: false, loading: false },
        { id: "kobalad", name: "Koba LaD !", playing: false, loading: false },
        { id: "pute", name: "AAH PUUUTEE !", playing: false, loading: false },
        { id: "u", name: "VROUM", playing: false, loading: false },
        {
          id: "bahnonenfait",
          name: "Bah non en fait.",
          playing: false,
          loading: false,
        },
        { id: "waaaeee", name: "WAAEEE :(", playing: false, loading: false },
        {
          id: "waaaeeuuu",
          name: "WAAEEE-UUUUUUUUU.",
          playing: false,
          loading: false,
        },
        { id: "wae", name: "WAE ?", playing: false, loading: false },
        {
          id: "wa-ee-smoke",
          name: "WA-EE-SMOKE",
          playing: false,
          loading: false,
        },
        { id: "dino", name: "DINONAURE", playing: false, loading: false },
        { id: "encule", name: "ENCULER !!!", playing: false, loading: false },
        {
          id: "pute2",
          name: "AAH PUUUTEE 2 !",
          playing: false,
          loading: false,
        },
        { id: "scooter", name: "SCOOTER", playing: false, loading: false },
        {
          id: "tamere",
          name: "...... Ta mère.",
          playing: false,
          loading: false,
        },
        {
          id: "baaarghh-gaborit",
          name: "BAAARGHH ! (GABORIT)",
          playing: false,
          loading: false,
        },
        {
          id: "baaarghh-gabin",
          name: "BAAARGHH ! (GABIN)",
          playing: false,
          loading: false,
        },
        {
          id: "baaarghh-maxouxax",
          name: "BAAARGHH ! (MAXOUXAX)",
          playing: false,
          loading: false,
        },
        { id: "iihh", name: "IIHH !", playing: false, loading: false },
        {
          id: "musique-baaarghh",
          name: "Musique BAAARGHH",
          playing: false,
          loading: false,
        },
        {
          id: "mejri-allo",
          name: "MEJRI - ALLO????",
          playing: false,
          loading: false,
        },
        {
          id: "mejri-atchoum",
          name: "MEJRI - Atchoum",
          playing: false,
          loading: false,
        },
        {
          id: "mejri-euh-pardon-interrogation",
          name: "MEJRI - Euh pardon ?",
          playing: false,
          loading: false,
        },
        {
          id: "mejri-normalement-cest-pas-grave",
          name: "MEJRI - Normalement c'est pas grave",
          playing: false,
          loading: false,
        },
        {
          id: "mejri-oh-vous-avez-entendu",
          name: "MEJRI - Oh vous avez entendu ?!",
          playing: false,
          loading: false,
        },
        {
          id: "mejri-vers-les-arduino-et-dotdotdot",
          name: "MEJRI - Vers les Arduino et ???",
          playing: false,
          loading: false,
        },
      ],
      audio: null,
    };
  },
};
</script>