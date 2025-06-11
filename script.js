    const volumeLevels = [0.2, 0.5, 0.9]; // Low, Medium, High
    const volumeNames = ["Low", "Medium", "High"];
    let currentVolumeIndex = 1; // Start at Medium
    const errorMessageEl = document.getElementById('errorMessage');
    const audio = document.getElementById('hevelAudio');
    const rickrollAudioEl = document.getElementById('rickrollAudio');
    const startup = document.getElementById('startup');
    const terminal = document.getElementById('terminal');
    const typed = document.getElementById('typed');
    const audioStatus = document.getElementById('audioStatus');
    const endPrompt = document.getElementById('endPrompt');

    const excerpts = [
      '"…they kept it quiet, buried under the first failures…"','"…I only remember the humming—then the static…"','"…we weren’t meant to hear this again…"','"…they called it recursion loss, whatever that means…"','"…he said the name before everything fell silent…"'
    ];
    const rickrollLyric = "You know the rules, and so do I...";

    let inputBuffer = "";
    let playbackStarted = false;
    let rickrollPlaying = false;
    let lyricInterval = null;

    function updateExcerpts() {
      if (rickrollPlaying) return;
      document.querySelectorAll(".excerpt").forEach(el => {
        el.textContent = "// transcribed excerpt: " + excerpts[Math.floor(Math.random() * excerpts.length)];
      });
    }

    function displayRickrollLyrics() {
      document.querySelectorAll(".excerpt").forEach(el => {
        el.textContent = rickrollLyric;
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
      if (rickrollAudioEl) rickrollAudioEl.volume = audio.volume;
    }

    function showCommands() {
      endPrompt.innerHTML += `<br/>> commands: p = pause/play, v = volume, q = quit`;
    }

    audio.addEventListener("ended", handlePlaybackEnd);

    if (rickrollAudioEl) {
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
        inputBuffer = "";
        if (typed) typed.textContent = inputBuffer;

        // Transition back to startup screen
        if (terminal) terminal.style.display = "none";
        if (startup) startup.style.display = "block";
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
            errorMessageEl.style.color = "#4AF626";
            errorMessageEl.innerHTML = "> ADMIN OVERRIDE TERMINATED.";
          }
          rickrollPlaying = false;
          inputBuffer = "";
          if(typed) typed.textContent = inputBuffer;

          // Transition back to startup screen
          if (terminal) terminal.style.display = "none";
          if (startup) startup.style.display = "block";
        }
        return;
      }

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
          if (inputBuffer === "admin") {
            if (errorMessageEl) errorMessageEl.textContent = "";
            if (errorMessageEl) { // This message shows on startup screen
                errorMessageEl.style.color = "#FF5555";
                errorMessageEl.innerHTML = "> EXECUTING ADMIN OVERRIDE...<br/>> WARNING: UNSTABLE FRAGMENT DETECTED...";
            }
            setTimeout(() => {
                // Show terminal for lyrics, hide startup
                if (startup) startup.style.display = "none";
                if (terminal) terminal.style.display = "block";
                document.querySelectorAll(".excerpt").forEach(el => el.textContent = ""); // Clear normal excerpts

                if (errorMessageEl) { // Clear initial admin messages from startup screen area
                    errorMessageEl.textContent = "";
                }
                // Message for terminal view's status line
                if (audioStatus) audioStatus.textContent = "-- playing: R1CK.HVL --";


                if (rickrollAudioEl) {
                    rickrollAudioEl.volume = audio.volume;
                    rickrollAudioEl.play();
                    rickrollPlaying = true;
                    if (lyricInterval) clearInterval(lyricInterval);
                    lyricInterval = setInterval(displayRickrollLyrics, 2000); // Faster interval
                    displayRickrollLyrics();
                } else {
                    // This error would now show on the (blank) terminal screen's audioStatus or endPrompt ideally
                    // For now, it might try errorMessageEl which is on the hidden startup screen.
                    // Let's ensure it's visible by temporarily showing startup or using a terminal element.
                    // Given current structure, let's put it in audioStatus as that's on terminal.
                    if (audioStatus) audioStatus.textContent = "> ERROR: Special audio module not found.";
                     // If error, revert to startup
                    if (terminal) terminal.style.display = "none";
                    if (startup) startup.style.display = "block";
                }
            }, 1500);
            inputBuffer = "";
            typed.textContent = "";
          } else if (inputBuffer === "list" || inputBuffer === "dir") {
            const listOutput = ["> ARCHIVE DIRECTORY LISTING:","  JONAS.HVL",""].join("<br/>");
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
      } else { // playbackStarted is true (and rickrollPlaying is false)
        if (e.key === "p") {
          if (audio.paused) {
            audio.play();
            monitorAudio();
          } else {
            audio.pause();
          }
        }
        if (e.key === "v") {
          currentVolumeIndex = (currentVolumeIndex + 1) % volumeLevels.length;
          audio.volume = volumeLevels[currentVolumeIndex];
          if (rickrollAudioEl) rickrollAudioEl.volume = audio.volume;
          audioStatus.textContent = `-- volume: ${volumeNames[currentVolumeIndex]} (${(audio.volume * 100).toFixed(0)}%)`;
        }
        if (e.key === "q") {
          audio.pause();
          audio.currentTime = 0;
          endPrompt.innerHTML = ">> playback terminated.";
          // Also ensure terminal stays, startup hidden (current state for main audio quit)
          if (startup) startup.style.display = "none";
          if (terminal) terminal.style.display = "block";
        }
      }
    });
