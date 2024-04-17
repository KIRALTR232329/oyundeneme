// Sorularınızı bu dizi içinde tanımlayın
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
let playerScore = 0;

document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('restart-game').addEventListener('click', startGame);

function startGame() {
    currentQuestionIndex = -1;
    playerScore = 0;
    document.getElementById('player-score').textContent = '0';
    document.getElementById('result-container').style.display = 'none';
    document.getElementById('info-column').style.display = 'block';
    showNextQuestion();
    resetTime();
}

function showNextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex >= Questions.length) {
        showResult(true, playerScore);
        return;
    }
    const question = Questions[currentQuestionIndex];
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
    resetTime();
}

function checkAnswer(selected, correct) {
    clearInterval(countdown);
    const answerButtons = document.querySelectorAll('.answerButton');
    answerButtons.forEach((button, index) => {
        button.disabled = true; // Tüm butonları devre dışı bırak
        const isCorrect = String.fromCharCode(65 + index) === correct;
        if (isCorrect) {
            button.classList.add('correct'); // Doğru cevabı yeşil yap
        }
        if (index === selected && !isCorrect) {
            button.classList.add('wrong'); // Yanlış seçilen şık kırmızı yap
        }
    });

    const feedback = document.getElementById('feedback');
    if (String.fromCharCode(65 + selected) === correct) {
        feedback.textContent = "Doğru!";
        feedback.style.color = "green";
        playerScore += 10;
        document.getElementById('player-score').textContent = playerScore;
        document.getElementById('next-question').style.display = 'block';
    } else {
        feedback.textContent = "Yanlış!";
        feedback.style.color = "red";
        setTimeout(() => showResult(false, playerScore), 2000); // Yanlış cevap verildiğinde 2 saniye sonra sonuç ekranını göster
    }
}


function resetTime() {
    clearInterval(countdown);
    timeLeft = 30;
    isExtended = false;
    document.getElementById('ask-friend').disabled = false;
    startCountdown();
}

function startCountdown() {
    countdown = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateCountdown();
        } else {
            clearInterval(countdown);
            showResult(false, playerScore);
        }
    }, 1000);
}

function updateCountdown() {
    const countdownText = document.getElementById('countdown-text');
    const countdownCircle = document.getElementById('countdown-circle').querySelector('circle');
    countdownText.textContent = timeLeft > 0 ? timeLeft : '';
    const totalDuration = isExtended ? 90 : 30;
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (timeLeft / totalDuration) * circumference;
    countdownCircle.style.strokeDashoffset = offset;
}

function extendTime() {
    if (!isExtended) {
        timeLeft += 30;
        isExtended = true;
        document.getElementById('ask-friend').disabled = true;
        updateCountdown();
    }
}

function showResult(isWin, score) {
    setTimeout(function() {
        const resultContainer = document.getElementById('result-container');
        const resultMessage = document.getElementById('result-message');
        const finalScore = document.getElementById('final-score');

        resultMessage.textContent = isWin ? "Tebrikler, Kazandınız!" : "Üzgünüz, Kaybettiniz!";
        finalScore.textContent = score;
        resultContainer.style.display = 'block';

        document.getElementById('restart-game').onclick = function() {
            startGame(); // Oyunu yeniden başlat
        };

        document.getElementById('go-home').onclick = function() {
            window.location.href = 'index.html'; // Ana sayfaya yönlendir
        };
    }, 3000);
}
