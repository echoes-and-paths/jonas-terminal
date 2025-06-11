    const volumeLevels = [0.2, 0.5, 0.9]; // Low, Medium, High
    const volumeNames = ["Low", "Medium", "High"];
    let currentVolumeIndex = 1; // Start at Medium
    const errorMessageEl = document.getElementById('errorMessage');
    const audio = document.getElementById('hevelAudio');
 fix/audio-ui-updates
    const rickrollAudioEl = document.getElementById('rickrollAudio');
 main
    const startup = document.getElementById('startup');
    const terminal = document.getElementById('terminal');
    const typed = document.getElementById('typed');
    const audioStatus = document.getElementById('audioStatus');
    const endPrompt = document.getElementById('endPrompt');
fix/audio-ui-updates

    const excerpts = [
      '"…they kept it quiet, buried under the first failures…"','"…I only remember the humming—then the static…"','"…we weren’t meant to hear this again…"','"…they called it recursion loss, whatever that means…"','"…he said the name before everything fell silent…"'
    ];
    const rickrollLyrics = [
      "We're no strangers to love...",
      "You know the rules, and so do I...",
      "A full commitment's what I'm thinking of...",
      "You wouldn't get this from any other guy...",
      "I just wanna tell you how I'm feeling...",
      "Gotta make you understand...",
      "",
      "Never gonna give you up,",
      "Never gonna let you down,",
      "Never gonna run around and desert you.",
      "Never gonna make you cry,",
      "Never gonna say goodbye,",
      "Never gonna tell a lie and hurt you.",
      "",
      "We've known each other for so long...",
      "Your heart's been aching, but you're too shy to say it...",
      "Inside, we both know what's been going on...",
      "We know the game and we're gonna play it...",
      "",
      "And if you ask me how I'm feeling...",
      "Don't tell me you're too blind to see...",
      "",
      "Never gonna give you up,",
      "Never gonna let you down,",
      "Never gonna run around and desert you.",
      "Never gonna make you cry,",
      "Never gonna say goodbye,",
      "Never gonna tell a lie and hurt you."
    ];

    let inputBuffer = "";
    let playbackStarted = false;
    let rickrollPlaying = false;
    let lyricInterval = null;
    let currentLyricIndex = 0;

    function updateExcerpts() {
      if (rickrollPlaying) return;

    const excerpts = [
      '"…they kept it quiet, buried under the first failures…"','"…I only remember the humming—then the static…"','"…we weren’t meant to hear this again…"','"…they called it recursion loss, whatever that means…"','"…he said the name before everything fell silent…"'
    ];
    let inputBuffer = "";
    let playbackStarted = false;

    function updateExcerpts() {
 main
      document.querySelectorAll(".excerpt").forEach(el => {
        el.textContent = "// transcribed excerpt: " + excerpts[Math.floor(Math.random() * excerpts.length)];
      });
    }

 fix/audio-ui-updates
    function displayRickrollLyrics() {
      if (currentLyricIndex < rickrollLyrics.length) {
        document.querySelectorAll(".excerpt").forEach(el => {
          el.textContent = rickrollLyrics[currentLyricIndex];
        });
        currentLyricIndex++;
      } else {
        if (lyricInterval) clearInterval(lyricInterval);
        lyricInterval = null; // Important to nullify after clearing
        currentLyricIndex = 0;
      }
    }

 main
    function formatTime(s) {
      const m = Math.floor(s / 60).toString().padStart(2, '0');
      const sec = Math.floor(s % 60).toString().padStart(2, '0');
      return `${m}:${sec}`;
    }

    function monitorAudio() {
      const duration = audio.duration || 200;
      const displayDuration = (audio.duration && isFinite(audio.duration) && audio.duration > 0) ? audio.duration : 200;
      const interval = setInterval(() => {
        if (audio.paused || audio.ended) { clearInterval(interval); return; }
        audioStatus.textContent = `-- time: ${formatTime(audio.currentTime)} / ${formatTime(displayDuration)}`;
      }, 1000);
    }

fix/audio-ui-updates
    function handlePlaybackEnd() { // For main audio

    function handlePlaybackEnd() {
main
      endPrompt.innerHTML = `>> end of audio signal<br/>play again? (y/n)`;
      document.addEventListener("keydown", function handler(e) {
        if (e.key === "y") {
          endPrompt.innerHTML = "";
          updateExcerpts();
          setInitialAudioSettings();
          audio.play();
          monitorAudio();
          document.removeEventListener("keydown", handler);
        } else if (e.key === "n") {
          endPrompt.innerHTML = `>> link closed.`;
          document.removeEventListener("keydown", handler);
        }
      });
    }

    function setInitialAudioSettings() {
      audio.volume = volumeLevels[currentVolumeIndex];
fix/audio-ui-updates
      if (rickrollAudioEl) rickrollAudioEl.volume = audio.volume;
    }

    function showCommands() {

    }

    function showCommands() { // MODIFIED FUNCTION
main
      endPrompt.innerHTML += `<br/>> commands: p = pause/play, v = volume, q = quit`;
    }

    audio.addEventListener("ended", handlePlaybackEnd);

 fix/audio-ui-updates
    if (rickrollAudioEl) { // Add listener for Rickroll audio end
      rickrollAudioEl.addEventListener("ended", () => {
        if (lyricInterval) {
          clearInterval(lyricInterval);
          lyricInterval = null;
        }
        document.querySelectorAll(".excerpt").forEach(el => el.textContent = "");

        if (errorMessageEl) {
            errorMessageEl.style.color = "#4AF626";
            errorMessageEl.textContent = ">> UNEXPECTED FRAGMENT PLAYBACK COMPLETED.";
        }

        rickrollPlaying = false;
        currentLyricIndex = 0;

        inputBuffer = "";
        if (typed) typed.textContent = inputBuffer;
      });
    }

    document.addEventListener("keydown", (e) => {
      if (rickrollPlaying) {
        if (e.key === "q") {
          if (rickrollAudioEl) {
            rickrollAudioEl.pause();
            rickrollAudioEl.currentTime = 0;
          }
          if (lyricInterval) {
            clearInterval(lyricInterval);
            lyricInterval = null;
          }
          document.querySelectorAll(".excerpt").forEach(el => el.textContent = "");
          if (errorMessageEl) {
            errorMessageEl.style.color = "#4AF626"; // Normal color for this message
            errorMessageEl.innerHTML = "> ADMIN OVERRIDE TERMINATED.";
          }
          rickrollPlaying = false;
          currentLyricIndex = 0;
          inputBuffer = "";
          if(typed) typed.textContent = inputBuffer;
        }
        return;
      }


    document.addEventListener("keydown", (e) => {
main
      if (!playbackStarted) {
        if (e.key.length === 1 && /^[a-zA-Z0-9]$/.test(e.key)) {
          if(errorMessageEl) errorMessageEl.textContent = "";
          inputBuffer += e.key.toLowerCase();
          typed.textContent = inputBuffer;
        } else if (e.key === "Backspace") {
          if(errorMessageEl) errorMessageEl.textContent = "";
          inputBuffer = inputBuffer.slice(0, -1);
          typed.textContent = inputBuffer;
        } else if (e.key === "Enter") {
fix/audio-ui-updates
          if (inputBuffer === "admin") {
            if (errorMessageEl) errorMessageEl.textContent = "";
            if (errorMessageEl) {
                errorMessageEl.style.color = "#FF5555";
                errorMessageEl.innerHTML = "> EXECUTING ADMIN OVERRIDE...<br/>> WARNING: UNSTABLE FRAGMENT DETECTED...";
            }
            setTimeout(() => {
                if (errorMessageEl) {
                    errorMessageEl.style.color = "#4AF626";
                    errorMessageEl.innerHTML = "> PLAYING RECOVERED AUDIO FRAGMENT...";
                }
                if (rickrollAudioEl) {
                    rickrollAudioEl.volume = audio.volume;
                    rickrollAudioEl.play();
                    rickrollPlaying = true;
                    currentLyricIndex = 0;
                    if (lyricInterval) clearInterval(lyricInterval);
                    lyricInterval = setInterval(displayRickrollLyrics, 3000);
                    displayRickrollLyrics();
                } else {
                    if(errorMessageEl) errorMessageEl.textContent = "> ERROR: Special audio module not found.";
                }
            }, 1500);
            inputBuffer = "";
            typed.textContent = "";
          } else if (inputBuffer === "list" || inputBuffer === "dir") {
            const listOutput = ["> ARCHIVE DIRECTORY LISTING:","  JONAS.HVL",""].join("<br/>");

          if (inputBuffer === "list" || inputBuffer === "dir") {
            const listOutput = [
                "> ARCHIVE DIRECTORY LISTING:",
                "  JONAS.HVL",
                ""
            ].join("<br/>");
main
            if(errorMessageEl) {
                errorMessageEl.style.color = "#4AF626";
                errorMessageEl.innerHTML = listOutput;
            }
            inputBuffer = "";
            typed.textContent = "";
          } else if (inputBuffer === "jonas") {
            if(errorMessageEl) errorMessageEl.textContent = "";
            startup.style.display = "none";
            terminal.style.display = "block";
            playbackStarted = true;
            updateExcerpts();
            setInitialAudioSettings();
            audio.play();
            monitorAudio();
            setInterval(updateExcerpts, 6000);
            showCommands();
          } else if (inputBuffer.length > 0) {
            if(errorMessageEl) {
                errorMessageEl.style.color = "#FF5555";
                errorMessageEl.textContent = "> ACCESS DENIED: Unknown archive.";
            }
            inputBuffer = "";
            typed.textContent = "";
          } else {
            if(errorMessageEl) errorMessageEl.textContent = "";
          }
        }
fix/audio-ui-updates
      } else { // playbackStarted is true (and rickrollPlaying is false)

      } else { // playbackStarted is true
main
        if (e.key === "p") {
          if (audio.paused) {
            audio.play();
            monitorAudio();
          } else {
            audio.pause();
          }
        }
 fix/audio-ui-updates
        if (e.key === "v") {
          currentVolumeIndex = (currentVolumeIndex + 1) % volumeLevels.length;
          audio.volume = volumeLevels[currentVolumeIndex];
          if (rickrollAudioEl) rickrollAudioEl.volume = audio.volume;

        // 'r' and 'f' key logic removed
        if (e.key === "v") {
          currentVolumeIndex = (currentVolumeIndex + 1) % volumeLevels.length;
          audio.volume = volumeLevels[currentVolumeIndex];
main
          audioStatus.textContent = `-- volume: ${volumeNames[currentVolumeIndex]} (${(audio.volume * 100).toFixed(0)}%)`;
        }
        if (e.key === "q") {
          audio.pause();
          audio.currentTime = 0;
          endPrompt.innerHTML = ">> playback terminated.";
        }
      }
    });
