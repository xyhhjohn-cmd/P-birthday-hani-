/* =========================================================
   HAPPY BIRTHDAY HONNEY — CINEMATIC V2
   Built-in sound effects + transitions + video + memories
   ========================================================= */

const scenes = document.querySelectorAll(".scene");
const transition = document.getElementById("transition");
const music = document.getElementById("birthdayMusic");

let currentScene = "opening";
let audioContext = null;
let musicStarted = false;


/* =========================================================
   AUDIO ENGINE
   No separate SFX files required.
========================================================= */

function initAudio() {

  if (!audioContext) {
    audioContext = new (
      window.AudioContext ||
      window.webkitAudioContext
    )();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}


function playTone(
  frequency,
  duration = .1,
  type = "sine",
  volume = .06
) {

  initAudio();

  const oscillator =
    audioContext.createOscillator();

  const gain =
    audioContext.createGain();

  oscillator.type = type;
  oscillator.frequency.value = frequency;

  gain.gain.setValueAtTime(
    volume,
    audioContext.currentTime
  );

  gain.gain.exponentialRampToValueAtTime(
    .001,
    audioContext.currentTime + duration
  );

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();

  oscillator.stop(
    audioContext.currentTime + duration
  );
}


function clickSound() {

  playTone(500, .06, "sine", .05);

  setTimeout(() => {
    playTone(720, .08, "sine", .035);
  }, 45);
}


function successSound() {

  playTone(523, .1, "sine", .055);

  setTimeout(() => {
    playTone(659, .1, "sine", .055);
  }, 100);

  setTimeout(() => {
    playTone(784, .18, "sine", .06);
  }, 200);
}


function errorSound() {

  playTone(180, .15, "sawtooth", .035);

  setTimeout(() => {
    playTone(130, .22, "sawtooth", .03);
  }, 130);
}


function revealSound() {

  playTone(392, .12, "sine", .045);

  setTimeout(() => {
    playTone(523, .12, "sine", .05);
  }, 100);

  setTimeout(() => {
    playTone(659, .12, "sine", .055);
  }, 200);

  setTimeout(() => {
    playTone(784, .25, "sine", .065);
  }, 300);
}


function countdownSound() {
  playTone(300, .12, "sine", .06);
}


/* =========================================================
   MUSIC
========================================================= */

function startMusic() {

  if (musicStarted) return;

  music.volume = .5;

  music.play()
    .then(() => {
      musicStarted = true;
    })
    .catch(() => {
      console.log(
        "Music playback is waiting for user interaction."
      );
    });
}


/* =========================================================
   CINEMATIC SCENE CHANGE
========================================================= */

function showScene(id, callback = null) {

  if (id === currentScene) return;

  transition.classList.add("show");

  setTimeout(() => {

    scenes.forEach(scene => {
      scene.classList.remove("active");
    });

    const target =
      document.getElementById(id);

    if (target) {
      target.classList.add("active");
    }

    currentScene = id;

    window.scrollTo({
      top: 0,
      behavior: "instant"
    });

    setTimeout(() => {

      transition.classList.remove("show");

      if (callback) {
        callback();
      }

    }, 120);

  }, 450);
}


/* =========================================================
   OPENING
========================================================= */

document
  .getElementById("startBtn")
  .addEventListener("click", () => {

    initAudio();

    clickSound();

    startMusic();

    createConfetti(35);

    setTimeout(() => {
      revealSound();
    }, 250);

    showScene("birthday");
  });


/* =========================================================
   STANDARD NEXT BUTTONS
========================================================= */

document
  .querySelectorAll(".next-btn")
  .forEach(button => {

    button.addEventListener("click", () => {

      const target =
        button.dataset.next;

      clickSound();

      showScene(target);

    });

  });


/* =========================================================
   COMEDY LOADING
========================================================= */

let comedyStarted = false;


function startComedy() {

  if (comedyStarted) return;

  comedyStarted = true;

  const bar =
    document.getElementById("loadingBar");

  const percent =
    document.getElementById("loadingPercent");

  const status =
    document.getElementById("loadingStatus");

  const error =
    document.getElementById("errorBox");

  let value = 0;

  const timer =
    setInterval(() => {

      value +=
        Math.floor(Math.random() * 7) + 3;

      if (value >= 100) {

        value = 100;

        clearInterval(timer);

        bar.style.width = "100%";
        percent.textContent = "100%";

        status.textContent =
          "Almost done... wait lang 😂";

        setTimeout(() => {

          error.classList.remove("hidden");

          status.classList.add("hidden");

          errorSound();

        }, 700);

        return;
      }

      bar.style.width =
        value + "%";

      percent.textContent =
        value + "%";


      if (value >= 69 && value < 80) {

        status.textContent =
          "69%... suspiciously specific. 😂";

      } else if (value >= 90) {

        status.textContent =
          "Ayaw kabalaka... kaya pa ni.";

      }

    }, 160);
}


/* Detect comedy scene */

const sceneObserver =
  new MutationObserver(() => {

    const comedy =
      document.getElementById("comedy");

    if (
      comedy.classList.contains("active")
    ) {
      startComedy();
    }

  });


sceneObserver.observe(
  document.body,
  {
    attributes: true,
    subtree: true,
    attributeFilter: ["class"]
  }
);


/* =========================================================
   FIX ERROR
========================================================= */

document
  .getElementById("fixError")
  .addEventListener("click", () => {

    clickSound();

    const body =
      document.querySelector(
        ".terminal-body"
      );

    body.innerHTML = `
      <div style="
        text-align:center;
        padding:25px 5px;
      ">

        <div style="
          font-size:65px;
          margin-bottom:18px;
        ">😂</div>

        <h2 style="
          color:#e4c7ff;
          margin-bottom:15px;
        ">
          SYSTEM FIXED.
        </h2>

        <p style="
          color:#aaa;
          line-height:1.8;
        ">
          Okay, okay... seryoso na gyud ko. 😭
        </p>

        <br>

        <button
          class="primary-btn"
          id="memoryStart"
        >
          LET'S SEE OUR MEMORIES →
        </button>

      </div>
    `;

    successSound();

    document
      .getElementById("memoryStart")
      .addEventListener("click", () => {

        clickSound();

        showScene("photo1");

      });

  });


/* =========================================================
   VIDEO INTRO COUNTDOWN
========================================================= */

let countdownStarted = false;


const videoIntroObserver =
  new MutationObserver(() => {

    const scene =
      document.getElementById("videoIntro");

    if (
      scene.classList.contains("active")
    ) {
      startCountdown();
    }

  });


videoIntroObserver.observe(
  document.body,
  {
    attributes: true,
    subtree: true,
    attributeFilter: ["class"]
  });


function startCountdown() {

  if (countdownStarted) return;

  countdownStarted = true;

  const counter =
    document.getElementById("countdown");

  let number = 3;

  counter.textContent = number;

  countdownSound();

  const timer =
    setInterval(() => {

      number--;

      if (number > 0) {

        counter.textContent =
          number;

        countdownSound();

      } else {

        clearInterval(timer);

        counter.textContent =
          "GO!";

        revealSound();

        setTimeout(() => {

          showScene(
            "videoScene",
            playBirthdayVideo
          );

        }, 550);

      }

    }, 900);
}


/* =========================================================
   VIDEO
========================================================= */

const birthdayVideo =
  document.getElementById(
    "birthdayVideo"
  );

const afterVideoBtn =
  document.getElementById(
    "afterVideoBtn"
  );


function playBirthdayVideo() {

  birthdayVideo.currentTime = 0;

  birthdayVideo.play()
    .then(() => {

      document
        .querySelector(".video-overlay")
        .style.opacity = "0";

    })
    .catch(() => {

      document
        .querySelector(".video-overlay")
        .style.opacity = "1";

    });
}


/* Video play if browser blocks autoplay */

document
  .querySelector(".video-frame")
  .addEventListener("click", () => {

    initAudio();

    birthdayVideo.play();

  });


birthdayVideo.addEventListener(
  "ended",
  () => {

    successSound();

    createConfetti(45);

    afterVideoBtn.classList.remove(
      "hidden"
    );

  }
);


afterVideoBtn.addEventListener(
  "click",
  () => {

    clickSound();

    showScene("postVideo");

  }
);


/* =========================================================
   SERIOUS MODE
========================================================= */

document
  .getElementById("serious")
  .addEventListener(
    "transitionend",
    () => {

      if (
        currentScene === "serious"
      ) {
        revealSound();
      }

    }
  );


/* =========================================================
   LETTER
========================================================= */

const letterText =
`Happy Birthday, Honney. 🎂💜

Karon imong special day, gusto lang ko nga mahibaw-an nimo nga I genuinely hope you have a beautiful day.

I hope makatawa ka, maka-enjoy ka, ug ma-feel nimo nga special gyud ka.

Dili man ko perfect sa pagpangita og words, pero I want you to know nga I appreciate the little moments, the random conversations, the jokes, and even the simple memories.

Sometimes, dili kinahanglan og expensive nga gift para mahimong meaningful ang usa ka butang.

Sometimes, enough na nga someone took the time to make something just for you.

Mao nang naghimo ko ani. 😂

Part joke, part memories, and part serious message from me.

Unta this new year of your life brings you more reasons to smile, more beautiful memories, and more moments nga worth remembering.

So once again...

Happy Birthday, Honney. ❤️

Enjoy your day.
Smile.
Have fun.
And please remember nga you deserve good things too.

— From someone who wanted to make your birthday a little more special. 💜`;


let letterStarted = false;


function startLetter() {

  if (letterStarted) return;

  letterStarted = true;

  const target =
    document.getElementById(
      "letterText"
    );

  const next =
    document.getElementById(
      "letterNext"
    );

  let index = 0;

  function typeWriter() {

    if (
      index < letterText.length
    ) {

      target.textContent +=
        letterText.charAt(index);

      index++;

      let delay = 25;

      if (
        letterText.charAt(index - 1)
        === "\n"
      ) {
        delay = 220;
      }

      setTimeout(
        typeWriter,
        delay
      );

    } else {

      next.classList.remove(
        "hidden"
      );

      successSound();

    }

  }

  typeWriter();
}


document
  .getElementById("letter")
  .addEventListener(
    "transitionend",
    () => {

      if (
        currentScene === "letter"
      ) {
        startLetter();
      }

    }
  );


document
  .getElementById("letterNext")
  .addEventListener(
    "click",
    () => {

      clickSound();

      showScene("gift");

    }
  );


/* =========================================================
   GIFT
========================================================= */

document
  .getElementById("giftButton")
  .addEventListener(
    "click",
    () => {

      clickSound();

      setTimeout(() => {
        revealSound();
      }, 250);

      createConfetti(120);

      document
        .getElementById("giftButton")
        .classList.add("hidden");

      document
        .getElementById("finalMessage")
        .classList.remove("hidden");

    }
  );


/* =========================================================
   RESTART
========================================================= */

document
  .getElementById("restartBtn")
  .addEventListener(
    "click",
    () => {

      clickSound();

      location.reload();

    }
  );


/* =========================================================
   CONFETTI
========================================================= */

function createConfetti(amount = 50) {

  const container =
    document.getElementById(
      "confetti"
    );

  const colors = [
    "#e4c7ff",
    "#c77dff",
    "#9d4edd",
    "#ffffff",
    "#a855f7"
  ];

  for (
    let i = 0;
    i < amount;
    i++
  ) {

    const piece =
      document.createElement("div");

    piece.className =
      "confetti-piece";

    const size =
      5 + Math.random() * 8;

    piece.style.left =
      Math.random() * 100 + "vw";

    piece.style.width =
      size + "px";

    piece.style.height =
      size * 1.6 + "px";

    piece.style.background =
      colors[
        Math.floor(
          Math.random() *
          colors.length
        )
      ];

    piece.style.animationDelay =
      Math.random() * .8 + "s";

    piece.style.animationDuration =
      2.5 +
      Math.random() * 2 +
      "s";

    container.appendChild(
      piece
    );

    setTimeout(() => {

      piece.remove();

    }, 5500);

  }
}


/* =========================================================
   FLOATING HEARTS
========================================================= */

function floatingHeart() {

  const heart =
    document.createElement("div");

  heart.textContent =
    Math.random() > .5
      ? "💜"
      : "✦";

  heart.style.position =
    "fixed";

  heart.style.left =
    Math.random() * 100 + "vw";

  heart.style.bottom =
    "-30px";

  heart.style.fontSize =
    12 +
    Math.random() * 15 +
    "px";

  heart.style.opacity =
    ".35";

  heart.style.pointerEvents =
    "none";

  heart.style.zIndex =
    "0";

  document.body.appendChild(
    heart
  );

  const duration =
    5 +
    Math.random() * 5;

  heart.animate(
    [
      {
        transform:
          "translateY(0) scale(.7)",
        opacity: 0
      },
      {
        transform:
          "translateY(-50vh) scale(1)",
        opacity: .45
      },
      {
        transform:
          "translateY(-110vh) scale(.5)",
        opacity: 0
      }
    ],
    {
      duration:
        duration * 1000,
      easing: "ease-out"
    }
  );

  setTimeout(() => {
    heart.remove();
  }, duration * 1000);

}


setInterval(
  floatingHeart,
  1700
);


/* =========================================================
   PRELOAD ASSETS
========================================================= */

const photos = [
  "photo1.jpg",
  "photo2.jpg",
  "photo3.jpg",
  "photo4.jpg"
];

photos.forEach(src => {

  const img =
    new Image();

  img.src = src;

});


/* =========================================================
   KEYBOARD SUPPORT
========================================================= */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Enter"
    ) {

      const button =
        document.querySelector(
          ".scene.active .primary-btn:not(.hidden)"
        );

      if (button) {
        button.click();
      }

    }

  }
);


/* =========================================================
   CONSOLE MESSAGE 😁
========================================================= */

console.log(
  "%c HAPPY BIRTHDAY, HONNEY! 💜 ",
  "font-size:22px;font-weight:bold;color:#c77dff;"
);

console.log(
  "Cinematic Birthday Website V2 loaded successfully."
);
