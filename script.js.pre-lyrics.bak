    const volumeLevels = [0.2, 0.5, 0.9]; // Low, Medium, High
    const volumeNames = ["Low", "Medium", "High"];
    let currentVolumeIndex = 1; // Start at Medium
    const errorMessageEl = document.getElementById('errorMessage');
    const audio = document.getElementById('hevelAudio');
    const startup = document.getElementById('startup');
    const terminal = document.getElementById('terminal');
    const typed = document.getElementById('typed');
    const audioStatus = document.getElementById('audioStatus');
    const endPrompt = document.getElementById('endPrompt');
    const excerpts = [
      '"…they kept it quiet, buried under the first failures…"','"…I only remember the humming—then the static…"','"…we weren’t meant to hear this again…"','"…they called it recursion loss, whatever that means…"','"…he said the name before everything fell silent…"'
    ];
    let inputBuffer = "";
    let playbackStarted = false;

    function updateExcerpts() {
      document.querySelectorAll(".excerpt").forEach(el => {
        el.textContent = "// transcribed excerpt: " + excerpts[Math.floor(Math.random() * excerpts.length)];
      });
    }

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

    function handlePlaybackEnd() {
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
    }

    function showCommands() { // MODIFIED FUNCTION
      endPrompt.innerHTML += `<br/>> commands: p = pause/play, v = volume, q = quit`;
    }

    audio.addEventListener("ended", handlePlaybackEnd);

    document.addEventListener("keydown", (e) => {
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
          if (inputBuffer === "list" || inputBuffer === "dir") {
            const listOutput = [
                "> ARCHIVE DIRECTORY LISTING:",
                "  JONAS.HVL",
                ""
            ].join("<br/>");
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
      } else { // playbackStarted is true
        if (e.key === "p") {
          if (audio.paused) {
            audio.play();
            monitorAudio();
          } else {
            audio.pause();
          }
        }
        // 'r' and 'f' key logic removed
        if (e.key === "v") {
          currentVolumeIndex = (currentVolumeIndex + 1) % volumeLevels.length;
          audio.volume = volumeLevels[currentVolumeIndex];
          audioStatus.textContent = `-- volume: ${volumeNames[currentVolumeIndex]} (${(audio.volume * 100).toFixed(0)}%)`;
        }
        if (e.key === "q") {
          audio.pause();
          audio.currentTime = 0;
          endPrompt.innerHTML = ">> playback terminated.";
        }
      }
    });
