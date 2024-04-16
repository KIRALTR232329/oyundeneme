const Questions = [
    {
        soru: "Hücre zarının temel işlevi nedir?",
        cevaplar: ["Hücreyi desteklemek", "Hücre içine giren ve çıkan maddeleri kontrol etmek", "Hücrenin hareket teşvikini sağlamak", "Protein sentezlemek"],
        doğru: "B"
    },
    {
        soru: "Fotosentez işlemi sırasında hangi gaz ortamında salınır?",
        cevaplar: ["Karbon dioksit", "Azot", "Oksijen", "Hidrojen"],
        doğru: "C"
    },
    {
        soru: "DNA'nın ana işlevi nedir?",
        cevaplar: ["Hücre bölünmesini sağlamak", "Genetik bilgiyi depolamak", "Protein üretimi", "Savunma"],
        doğru: "B"
    },
    {
        soru: "Aşağıdakilerden hangisinin mitoz bölünmesi sonucu oluşur?",
        cevaplar: ["Gamet hücreleri", "Kök hücreleri", "Vücut hücreleri", "Sperm ve yumurta hücreleri"],
        doğru: "C"
    },
    {
        soru: "Hangi organ sistemi vücutta oksijen taşınmasını sağlar?",
        cevaplar: ["Sindirim sistemi", "Dolaşım sistemi", "Solunum sistemi", "Boşaltım sistemi"],
        doğru: "C"
    }
];

let currentQuestionIndex = -1;
let countdown;
let timeLeft = 30;
let isExtended = false;

function startGame() {
    document.getElementById('info-column').style.display = 'block';
    showNextQuestion();
}

function showNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex >= Questions.length) {
        restartGame();
        return;
    }
    const question = Questions[currentQuestionIndex];
    shuffleAnswers(question.cevaplar); // Şıkları karıştır
    const mainMenu = document.getElementById('mainMenu');
    mainMenu.innerHTML = `<h2>${question.soru}</h2>`;
    question.cevaplar.forEach((answer, i) => {
        const button = document.createElement('button');
        button.textContent = String.fromCharCode(65 + i) + ") " + answer;
        button.className = 'answerButton';
        button.onclick = () => checkAnswer(i, question.doğru);
        mainMenu.appendChild(button);
    });
    const feedback = document.createElement('div');
    feedback.id = 'feedback';
    mainMenu.appendChild(feedback);
    const nextQuestionButton = document.createElement('button');
    nextQuestionButton.id = 'next-question';
    nextQuestionButton.className = 'menuButton';
    nextQuestionButton.textContent = 'Sonraki Soru';
    nextQuestionButton.style.display = 'none';
    nextQuestionButton.onclick = () => showNextQuestion();
    mainMenu.appendChild(nextQuestionButton);
    resetTime(); // Her soruda geri sayımı baştan başlat
}

function checkAnswer(selected, correct) {
    const feedback = document.getElementById('feedback');
    clearInterval(countdown);
    document.querySelectorAll('.answerButton').forEach(button => button.disabled = true);
    if (String.fromCharCode(65 + selected) === correct) {
        feedback.textContent = "Doğru!";
        feedback.style.color = "green";
        const nextQuestionButton = document.getElementById('next-question');
        nextQuestionButton.style.display = 'block';
        document.querySelectorAll('.answerButton')[selected].classList.add('correct');
        updateScore(10);
    } else {
        feedback.textContent = "Yanlış! Oyun bitti.";
        feedback.style.color = "red";
        const mainMenu = document.getElementById('mainMenu');
        const restartButton = document.createElement('button');
        restartButton.className = 'menuButton';
        restartButton.textContent = 'Oyunu Yeniden Başlat';
        restartButton.onclick = () => restartGame();
        const mainMenuButton = document.createElement('button');
        mainMenuButton.className = 'menuButton';
        mainMenuButton.textContent = 'Ana Menü';
        mainMenuButton.onclick = () => showMainMenu();
        mainMenu.appendChild(restartButton);
        mainMenu.appendChild(mainMenuButton);
    }
}

function updateScore(score) {
    playerScore += score;
    document.getElementById('player-score').textContent = playerScore;
}

function resetTime() {
    clearInterval(countdown);
    timeLeft = 30;
    isExtended = false;
    document.getElementById('ask-friend').disabled = false;
    startCountdown(); // Geri sayımı başlat
    updateCountdown(); // Geri sayımı güncelle
}

function startCountdown() {
    clearInterval(countdown);
    countdown = setInterval(() => {
        if (timeLeft !== Infinity) {
            timeLeft--;
            updateCountdown();
        }
        if (timeLeft <= 0) {
            clearInterval(countdown);
            alert("Süre doldu! Oyun bitti.");
            document.location.reload();
        }
    }, 1000);
}

function extendTime() {
    if (!isExtended) {
        timeLeft += 60;
        isExtended = true;
        document.getElementById('ask-friend').disabled = true;
        updateCountdown();
    }
}

function updateCountdown() {
    const countdownText = document.getElementById('countdown-text');
    const countdownCircle = document.getElementById('countdown-circle').querySelector('circle');
    countdownText.textContent = timeLeft > 0 ? timeLeft : '';
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (timeLeft / 30) * circumference;
    countdownCircle.style.strokeDashoffset = offset;
}

function restartGame() {
    currentQuestionIndex = -1;
    shuffleQuestions(Questions); // Soruları karıştır
    showNextQuestion(); // Yeniden başlat
}

function shuffleAnswers(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function shuffleQuestions(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function showMainMenu() {
    document.location.reload();
}

document.getElementById('start-game').addEventListener('click', startGame);
