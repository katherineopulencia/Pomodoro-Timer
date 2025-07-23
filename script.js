 const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const timerDisplay = document.querySelector('.timer-display');
    const workInput = document.getElementById('workDuration');
    const breakInput = document.getElementById('breakDuration');
    const soundToggle = document.getElementById('soundToggle');
    const soundIcon = document.getElementById('soundIcon');
    const progressCircle = document.getElementById('progressCircle');

    const startSound = document.getElementById('startSound');
    const endSound = document.getElementById('endSound');
    const tickSound = document.getElementById('tickSound');

    const radius = progressCircle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    progressCircle.style.strokeDasharray = `${circumference}`;
    progressCircle.style.strokeDashoffset = '0';

    let workDuration = parseInt(workInput.value) * 60;
    let breakDuration = parseInt(breakInput.value) * 60;
    let timeLeft = workDuration;
    let timer = null;
    let isRunning = false;
    let isWorkTime = true;
    let soundOn = true;

    function formatTime(seconds) {
      const m = Math.floor(seconds / 60)
        .toString()
        .padStart(2, '0');
      const s = (seconds % 60).toString().padStart(2, '0');
      return `${m}:${s}`;
    }

    function updateDisplay() {
      timerDisplay.textContent = formatTime(timeLeft);
      if (isWorkTime) {
        timerDisplay.classList.remove('text-purple-700');
        timerDisplay.classList.add('text-pink-700');
        progressCircle.style.stroke = '#ec4899';
      } else {
        timerDisplay.classList.remove('text-pink-700');
        timerDisplay.classList.add('text-purple-700');
        progressCircle.style.stroke = '#7c3aed';
      }
      updateProgress();
    }

    function updateProgress() {
      let totalTime = isWorkTime ? workDuration : breakDuration;
      const offset = circumference - (timeLeft / totalTime) * circumference;
      progressCircle.style.strokeDashoffset = offset;
    }

    function playSound(sound) {
      if (!soundOn) return;
      sound.currentTime = 0;
      sound.play();
    }

    function tick() {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
        if (timeLeft <= 5 && timeLeft > 0) {
          playSound(tickSound);
        }
      } else {
        playSound(endSound);
        clearInterval(timer);
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        if (isWorkTime) {
          isWorkTime = false;
          timeLeft = breakDuration;
          updateDisplay();
          startBtn.textContent = 'Start Break';
          startBtn.disabled = false;
        } else {
          isWorkTime = true;
          timeLeft = workDuration;
          updateDisplay();
          startBtn.textContent = 'Start Work';
          startBtn.disabled = false;
        }
      }
    }

    function startTimer() {
      if (isRunning) return;
      isRunning = true;
      startBtn.disabled = true;
      pauseBtn.disabled = false;
      playSound(startSound);
      timer = setInterval(tick, 1000);
    }

    function pauseTimer() {
      if (!isRunning) return;
      isRunning = false;
      clearInterval(timer);
      startBtn.disabled = false;
      pauseBtn.disabled = true;
    }

    function resetTimer() {
      clearInterval(timer);
      isRunning = false;
      isWorkTime = true;
      workDuration = parseInt(workInput.value) * 60;
      breakDuration = parseInt(breakInput.value) * 60;
      timeLeft = workDuration;
      updateDisplay();
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      startBtn.textContent = 'Start';
    }

    startBtn.addEventListener('click', () => {
      if (startBtn.textContent.includes('Break')) {
        isWorkTime = false;
        timeLeft = breakDuration;
      } else if (startBtn.textContent.includes('Work')) {
        isWorkTime = true;
        timeLeft = workDuration;
      }
      updateDisplay();
      startTimer();
      startBtn.textContent = 'Running...';
    });

    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);

    workInput.addEventListener('change', () => {
      let val = parseInt(workInput.value);
      if (isNaN(val) || val < 1) val = 1;
      if (val > 60) val = 60;
      workInput.value = val;
      if (!isRunning && isWorkTime) {
        workDuration = val * 60;
        timeLeft = workDuration;
        updateDisplay();
      }
    });

    breakInput.addEventListener('change', () => {
      let val = parseInt(breakInput.value);
      if (isNaN(val) || val < 1) val = 1;
      if (val > 30) val = 30;
      breakInput.value = val;
      if (!isRunning && !isWorkTime) {
        breakDuration = val * 60;
        timeLeft = breakDuration;
        updateDisplay();
      }
    });

    soundToggle.addEventListener('click', () => {
      soundOn = !soundOn;
      if (soundOn) {
        soundIcon.classList.remove('fa-volume-mute');
        soundIcon.classList.add('fa-volume-up');
      } else {
        soundIcon.classList.remove('fa-volume-up');
        soundIcon.classList.add('fa-volume-mute');
      }
    });

    updateDisplay();