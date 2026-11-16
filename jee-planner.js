
// ==========================================
// NEXVIAN JEE MAIN - 54 DAYS STUDY PLANNER
// ==========================================

const daysContainer = document.getElementById("daysContainer");

let plannerData = JSON.parse(
    localStorage.getItem("nexvianJEE54") || "[]"
);

let currentFilter = "All";

// ==========================================
// SAVE PLANNER DATA
// ==========================================

function saveData() {
    localStorage.setItem(
        "nexvianJEE54",
        JSON.stringify(plannerData)
    );
}

function getDayData(day) {
    return plannerData.find(item => item.day === day) || {
        day,
        subject: "",
        chapter: "",
        studyHours: "",
        theory: "",
        learningPath: "",
        notes: "",
        pdf: "",
        questions: "",
        pyq: "",
        mock: "",
        remarks: "",
        status: "Not Started"
    };
}

function updateField(day, field, value) {
    let data = getDayData(day);

    const index = plannerData.findIndex(
        item => item.day === day
    );

    data[field] = value;

    if (index === -1) {
        plannerData.push(data);
    } else {
        plannerData[index] = data;
    }

    saveData();
    updateProgress();
}

// ==========================================
// RENDER 54 COMPACT DAY CARDS
// ==========================================

function renderDays() {
    daysContainer.innerHTML = "";

    for (let day = 1; day <= 54; day++) {

        const data = getDayData(day);

        if (
            currentFilter !== "All" &&
            data.subject !== currentFilter
        ) {
            continue;
        }

        const card = document.createElement("div");
        card.className = "day-card";
        card.dataset.day = day;

        card.innerHTML = `
            <details class="day-details">

                <summary>
                    <span class="day-title">DAY ${day}</span>
                    <span class="day-status">
                        ${data.status}
                    </span>
                    <span class="day-arrow">＋</span>
                </summary>

                <div class="day-content">

                    <label>Subject</label>
                    <select class="subject">
                        <option value="">Select Subject</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Mathematics">Mathematics</option>
                    </select>

                    <label>Chapter / Today's Target</label>
                    <input class="chapter"
                        placeholder="Enter chapter or target">

                    <label>Study Hours</label>
                    <input class="studyHours"
                        type="number" min="0" step="0.5"
                        placeholder="Enter study hours">

                    <label>Theory / Study Notes</label>
                    <textarea class="theory"
                        placeholder="Write your own theory"></textarea>

                    <label>Basics to Advanced Learning</label>
                    <textarea class="learningPath"
                        placeholder="Write your learning steps"></textarea>

                    <h4 class="material-heading">MY STUDY MATERIALS</h4>

                    <label>Upload Notes / PDF</label>
                    <input type="file" class="notes-upload"
                        accept=".pdf,.txt,.doc,.docx">

                    <label>Upload Questions PDF</label>
                    <input type="file" class="questions-upload"
                        accept=".pdf">

                    <label>Upload PYQ PDF</label>
                    <input type="file" class="pyq-upload"
                        accept=".pdf">

                    <div class="uploaded-materials">
                        <h4>Uploaded Materials</h4>
                        <div class="material-list">
                            No materials uploaded yet.
                        </div>
                    </div>

                    <label>Notes Link</label>
                    <input class="notes"
                        placeholder="Paste your notes link">

                    <label>PDF Material Link</label>
                    <input class="pdf"
                        placeholder="Paste PDF link">

                    <label>Questions Practice</label>
                    <textarea class="questions"
                        placeholder="Add your practice progress or question links"></textarea>

                    <label>JEE Main PYQ Link</label>
                    <input class="pyq"
                        placeholder="Paste PYQ link">

                    <label>Mock Test Score</label>
                    <input class="mock"
                        placeholder="Enter your score">

                    <label>Personal Remarks</label>
                    <textarea class="remarks"
                        placeholder="Write your remarks"></textarea>

                    <label>Completion Status</label>
                    <select class="status">
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>

                    <button class="save-btn">
                        Save Day ${day}
                    </button>

                </div>
            </details>
        `;

        const fields = [
            "subject",
            "chapter",
            "studyHours",
            "theory",
            "learningPath",
            "notes",
            "pdf",
            "questions",
            "pyq",
            "mock",
            "remarks",
            "status"
        ];

        fields.forEach(field => {
            card.querySelector("." + field).value =
                data[field] || "";
        });

        card.querySelector(".save-btn")
            .addEventListener("click", () => {

                fields.forEach(field => {
                    updateField(
                        day,
                        field,
                        card.querySelector("." + field).value
                    );
                });

                card.querySelector(".day-status").textContent =
                    card.querySelector(".status").value;

                alert("Day " + day + " saved successfully!");
            });

        // Upload Notes
        card.querySelector(".notes-upload")
            .addEventListener("change", function() {
                if (this.files[0]) {
                    saveMaterial(day, "Notes", this.files[0]);
                    this.value = "";
                }
            });

        // Upload Questions
        card.querySelector(".questions-upload")
            .addEventListener("change", function() {
                if (this.files[0]) {
                    saveMaterial(day, "Questions", this.files[0]);
                    this.value = "";
                }
            });

        // Upload PYQ
        card.querySelector(".pyq-upload")
            .addEventListener("change", function() {
                if (this.files[0]) {
                    saveMaterial(day, "PYQ", this.files[0]);
                    this.value = "";
                }
            });

        // Update card status when status changes
        card.querySelector(".status")
            .addEventListener("change", function() {
                card.querySelector(".day-status").textContent =
                    this.value;
            });

        daysContainer.appendChild(card);

        showMaterials(day);
    }
}

// ==========================================
// FILTER BUTTONS
// ==========================================

document.querySelectorAll(".filter-btn").forEach(button => {

    button.addEventListener("click", function() {

        document.querySelectorAll(".filter-btn")
            .forEach(btn => btn.classList.remove("active"));

        this.classList.add("active");

        currentFilter = this.dataset.filter;

        renderDays();
    });

});

// ==========================================
// PROGRESS TRACKING
// ==========================================

function updateProgress() {

    const completed = plannerData.filter(
        item => item.status === "Completed"
    ).length;

    const percentage = Math.round(
        (completed / 54) * 100
    );

    document.getElementById("completedDays").textContent =
        completed;

    document.getElementById("progressPercent").textContent =
        percentage + "%";

    document.getElementById("progressFill").style.width =
        percentage + "%";

    const subjects = [
        { name: "Physics", id: "physics" },
        { name: "Chemistry", id: "chemistry" },
        { name: "Mathematics", id: "maths" }
    ];

    subjects.forEach(subject => {

        const count = plannerData.filter(
            item =>
                item.subject === subject.name &&
                item.status === "Completed"
        ).length;

        document.getElementById(
            subject.id + "Progress"
        ).textContent = count + " / 54";

        document.getElementById(
            subject.id + "Fill"
        ).style.width = (count / 54 * 100) + "%";

    });
}

// ==========================================
// DOWNLOAD BACKUP
// ==========================================

function exportPlanner() {

    const backup = JSON.stringify(plannerData, null, 2);

    const blob = new Blob([backup], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "NEXVIAN-JEE-54-Days-Backup.json";

    link.click();

    URL.revokeObjectURL(url);
}

// ==========================================
// RESTORE BACKUP
// ==========================================

function importPlanner(event) {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {

        try {

            const restored = JSON.parse(e.target.result);

            if (
                !Array.isArray(restored) ||
                !restored.every(item =>
                    item &&
                    Number.isInteger(item.day) &&
                    item.day >= 1 &&
                    item.day <= 54
                )
            ) {
                throw new Error("Invalid backup");
            }

            const days = restored.map(item => ({
                ...item,
                subject: item.subject || "",
                chapter: item.chapter || "",
                studyHours: item.studyHours || "",
                theory: item.theory || "",
                learningPath: item.learningPath || "",
                notes: item.notes || "",
                pdf: item.pdf || "",
                questions: item.questions || "",
                pyq: item.pyq || "",
                mock: item.mock || "",
                remarks: item.remarks || "",
                status: item.status || "Not Started"
            }));

            if (!confirm(
                "Current planner data will be replaced. Continue?"
            )) {
                return;
            }

            plannerData = days;

            saveData();
            renderDays();
            updateProgress();

            alert("Planner restored successfully!");

        } catch(error) {
            alert("Invalid backup file!");
        }

        event.target.value = "";
    };

    reader.readAsText(file);
}

// ==========================================
// INDEXED DB - STUDY MATERIALS
// ==========================================

let materialDB = null;

if ("indexedDB" in window) {

    const requestDB = indexedDB.open(
        "NEXVIAN_JEE_MATERIALS", 1
    );

    requestDB.onupgradeneeded = function(event) {

        const db = event.target.result;

        if (!db.objectStoreNames.contains("materials")) {
            db.createObjectStore("materials", {
                keyPath: "id",
                autoIncrement: true
            });
        }
    };

    requestDB.onsuccess = function(event) {

        materialDB = event.target.result;
        window.nexvianDB = materialDB;

        for (let day = 1; day <= 54; day++) {
            showMaterials(day);
        }

        console.log("NEXVIAN Material Database Ready");
    };

    requestDB.onerror = function() {
        console.error("Material database could not be opened.");
    };
}

// SAVE MATERIAL

function saveMaterial(day, category, file) {

    if (!materialDB) {
        alert("Material database is not ready. Refresh and try again.");
        return;
    }

    const transaction = materialDB.transaction(
        ["materials"], "readwrite"
    );

    transaction.objectStore("materials").add({
        day,
        category,
        name: file.name,
        file,
        date: new Date().toISOString()
    });

    transaction.oncomplete = function() {
        alert("Material uploaded successfully!");
        showMaterials(day);
    };

    transaction.onerror = function() {
        alert("Material upload failed!");
    };
}

// SHOW MATERIALS

function showMaterials(day) {

    if (!materialDB) return;

    const card = document.querySelector(
        `.day-card[data-day="${day}"]`
    );

    if (!card) return;

    const list = card.querySelector(".material-list");

    if (!list) return;

    const transaction = materialDB.transaction(
        ["materials"], "readonly"
    );

    const request = transaction
        .objectStore("materials")
        .getAll();

    request.onsuccess = function() {

        const materials = request.result.filter(
            item => item.day === day
        );

        list.innerHTML = "";

        if (materials.length === 0) {
            list.textContent = "No materials uploaded yet.";
            return;
        }

        materials.forEach(item => {

            const row = document.createElement("div");
            row.className = "material-item";

            const name = document.createElement("span");
            name.textContent =
                item.category + ": " + item.name;

            const open = document.createElement("a");
            open.textContent = "Open";
            open.href = URL.createObjectURL(item.file);
            open.target = "_blank";
            open.rel = "noopener";

            const remove = document.createElement("button");
            remove.textContent = "Delete";

            remove.addEventListener("click", function() {

                if (!confirm("Delete this material?")) return;

                const deleteTransaction = materialDB.transaction(
                    ["materials"], "readwrite"
                );

                deleteTransaction
                    .objectStore("materials")
                    .delete(item.id);

                deleteTransaction.oncomplete = function() {
                    showMaterials(day);
                };
            });

            row.append(name, open, remove);
            list.appendChild(row);
        });
    };
}

// ==========================================
// MOCK TEST QUESTION BANK
// ==========================================

const MOCK_STORAGE_KEY = "nexvianJEEQuestions";

let questionBank = JSON.parse(
    localStorage.getItem(MOCK_STORAGE_KEY) || "[]"
);

function saveQuestionBank() {
    localStorage.setItem(
        MOCK_STORAGE_KEY,
        JSON.stringify(questionBank)
    );
}

const mockSubject = document.getElementById("mockSubject");
const mockQuestion = document.getElementById("mockQuestion");
const optionInputs = [
    document.getElementById("optionA"),
    document.getElementById("optionB"),
    document.getElementById("optionC"),
    document.getElementById("optionD")
];
const correctOption = document.getElementById("correctOption");
const mockExplanation = document.getElementById("mockExplanation");

const questionBankCount =
    document.getElementById("questionBankCount");

const availableQuestions =
    document.getElementById("availableQuestions");

const addMockQuestion =
    document.getElementById("addMockQuestion");

// QUESTION BANK LIST

const bankList = document.createElement("div");
bankList.className = "mock-question-list";

questionBankCount.after(bankList);

function renderQuestionBank() {

    questionBankCount.textContent =
        questionBank.length + " questions added";

    availableQuestions.textContent =
        questionBank.length === 0
            ? "Your question bank is empty."
            : questionBank.length + " questions available for your test.";

    document.getElementById("startMockTest").disabled =
        questionBank.length === 0;

    bankList.innerHTML = "";

    questionBank.forEach((question, index) => {

        const item = document.createElement("div");
        item.className = "mock-bank-item";

        const title = document.createElement("span");
        title.textContent =
            (index + 1) + ". " +
            question.subject + " — " +
            question.question;

        const remove = document.createElement("button");
        remove.textContent = "Delete";

        remove.addEventListener("click", function() {

            if (!confirm("Delete this question?")) return;

            questionBank.splice(index, 1);

            saveQuestionBank();
            renderQuestionBank();
        });

        item.append(title, remove);
        bankList.appendChild(item);
    });
}

// ADD QUESTION

addMockQuestion.addEventListener("click", function() {

    const questionText = mockQuestion.value.trim();

    const options = optionInputs.map(
        input => input.value.trim()
    );

    if (
        !questionText ||
        options.some(option => !option)
    ) {
        alert("Please enter the question and all four options.");
        return;
    }

    questionBank.push({
        subject: mockSubject.value,
        question: questionText,
        options,
        correct: Number(correctOption.value),
        explanation: mockExplanation.value.trim()
    });

    saveQuestionBank();
    renderQuestionBank();

    mockQuestion.value = "";
    optionInputs.forEach(input => input.value = "");
    mockExplanation.value = "";

    alert("Question added successfully!");
});

// ==========================================
// MOCK TEST ENGINE
// ==========================================

let testQuestions = [];
let currentQuestion = 0;
let answers = [];
let markedForReview = [];
let timeRemaining = 0;
let timerInterval = null;
let testSubmitted = false;

const mockTestArea = document.getElementById("mockTestArea");
const mockResult = document.getElementById("mockResult");
const mockTimer = document.getElementById("mockTimer");

const testSubject = document.getElementById("testSubject");
const testQuestion = document.getElementById("testQuestion");
const testOptions = document.getElementById("testOptions");
const questionPalette = document.getElementById("questionPalette");
const testStatus = document.getElementById("testStatus");

const startMockTest = document.getElementById("startMockTest");

// START TEST

startMockTest.addEventListener("click", function() {

    if (questionBank.length === 0) return;

    const duration = Number(
        document.getElementById("mockDuration").value
    );

    if (!Number.isFinite(duration) || duration < 1) {
        alert("Enter a valid test duration.");
        return;
    }

    testQuestions = questionBank.map(question => ({
        ...question,
        options: [...question.options]
    }));

    answers = new Array(testQuestions.length).fill(null);
    markedForReview = new Array(testQuestions.length).fill(false);

    currentQuestion = 0;
    testSubmitted = false;
    timeRemaining = duration * 60;

    mockResult.hidden = true;
    mockTestArea.hidden = false;

    startMockTest.disabled = true;

    renderTestQuestion();
    renderQuestionPalette();
    updateTimer();

    clearInterval(timerInterval);

    timerInterval = setInterval(function() {

        timeRemaining--;

        updateTimer();

        if (timeRemaining <= 0) {
            submitTest(true);
        }

    }, 1000);

    mockTestArea.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

// TIMER

function updateTimer() {

    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    mockTimer.textContent =
        String(hours).padStart(2, "0") + ":" +
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");
}

// RENDER CURRENT QUESTION

function renderTestQuestion() {

    const question = testQuestions[currentQuestion];

    if (!question) return;

    testSubject.textContent =
        "Question " + (currentQuestion + 1) +
        " of " + testQuestions.length +
        " | " + question.subject;

    testQuestion.textContent = question.question;

    testOptions.innerHTML = "";

    question.options.forEach((option, index) => {

        const label = document.createElement("label");
        label.className = "test-option";

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "testAnswer";
        radio.value = index;
        radio.checked = answers[currentQuestion] === index;

        radio.addEventListener("change", function() {
            answers[currentQuestion] = index;
            renderQuestionPalette();
        });

        const text = document.createElement("span");
        text.textContent =
            String.fromCharCode(65 + index) + ". " + option;

        label.append(radio, text);
        testOptions.appendChild(label);
    });

    testStatus.textContent =
        markedForReview[currentQuestion]
            ? "Marked for Review"
            : answers[currentQuestion] !== null
                ? "Answered"
                : "Not Answered";
}

// QUESTION PALETTE

function renderQuestionPalette() {

    questionPalette.innerHTML = "";

    testQuestions.forEach((question, index) => {

        const button = document.createElement("button");
        button.type = "button";
        button.textContent = index + 1;

        if (answers[index] !== null) {
            button.classList.add("answered");
        }

        if (markedForReview[index]) {
            button.classList.add("marked");
        }

        if (index === currentQuestion) {
            button.classList.add("current");
        }

        button.addEventListener("click", function() {
            currentQuestion = index;
            renderTestQuestion();
            renderQuestionPalette();
        });

        questionPalette.appendChild(button);
    });
}

// SAVE & NEXT

document.getElementById("nextQuestion")
    .addEventListener("click", function() {

        if (currentQuestion < testQuestions.length - 1) {
            currentQuestion++;
            renderTestQuestion();
            renderQuestionPalette();
        } else {
            alert("This is the last question. You can submit the test.");
        }
    });

// CLEAR RESPONSE

document.getElementById("clearAnswer")
    .addEventListener("click", function() {

        answers[currentQuestion] = null;

        renderTestQuestion();
        renderQuestionPalette();
    });

// MARK FOR REVIEW

document.getElementById("markReview")
    .addEventListener("click", function() {

        markedForReview[currentQuestion] =
            !markedForReview[currentQuestion];

        renderTestQuestion();
        renderQuestionPalette();
    });

// SUBMIT TEST

document.getElementById("submitMockTest")
    .addEventListener("click", function() {
        submitTest(false);
    });

function submitTest(autoSubmit) {

    if (testSubmitted) return;

    if (
        !autoSubmit &&
        !confirm("Are you sure you want to submit your test?")
    ) {
        return;
    }

    testSubmitted = true;

    clearInterval(timerInterval);

    let correct = 0;
    let wrong = 0;
    let unanswered = 0;

    const subjectResults = {
        Physics: { correct: 0, wrong: 0, unanswered: 0 },
        Chemistry: { correct: 0, wrong: 0, unanswered: 0 },
        Mathematics: { correct: 0, wrong: 0, unanswered: 0 }
    };

    testQuestions.forEach((question, index) => {

        const result = subjectResults[question.subject];

        if (answers[index] === null) {
            unanswered++;
            result.unanswered++;
        } else if (answers[index] === question.correct) {
            correct++;
            result.correct++;
        } else {
            wrong++;
            result.wrong++;
        }
    });

    // JEE Main style marking: +4 correct, -1 wrong
    const score = (correct * 4) - wrong;

    const accuracy = answers.filter(
        answer => answer !== null
    ).length === 0
        ? 0
        : Math.round(
            correct /
            answers.filter(answer => answer !== null).length * 100
        );

    mockTestArea.hidden = true;
    mockResult.hidden = false;

    mockResult.innerHTML = `
        <div class="mock-result-card">
            <h2>Mock Test Result</h2>
            <h1>${score}</h1>
            <p>Score out of ${testQuestions.length * 4}</p>

            <div class="result-stats">
                <div><strong>${correct}</strong><span>Correct</span></div>
                <div><strong>${wrong}</strong><span>Wrong</span></div>
                <div><strong>${unanswered}</strong><span>Unanswered</span></div>
                <div><strong>${accuracy}%</strong><span>Accuracy</span></div>
            </div>

            <h3>Subject-wise Result</h3>
            <div id="subjectResultList"></div>

            <h3>Answer Review</h3>
            <div id="answerReview"></div>

            <button id="closeMockResult" type="button">
                Finish Review
            </button>
        </div>
    `;

    const subjectResultList =
        document.getElementById("subjectResultList");

    Object.entries(subjectResults).forEach(([subject, result]) => {

        const row = document.createElement("p");

        row.textContent =
            subject + ": " +
            result.correct + " correct, " +
            result.wrong + " wrong, " +
            result.unanswered + " unanswered";

        subjectResultList.appendChild(row);
    });

    const answerReview = document.getElementById("answerReview");

    testQuestions.forEach((question, index) => {

        const item = document.createElement("div");
        item.className = "answer-review-item";

        const heading = document.createElement("h4");
        heading.textContent =
            "Q" + (index + 1) + " — " + question.subject;

        const prompt = document.createElement("p");
        prompt.textContent = question.question;

        const yourAnswer = document.createElement("p");
        yourAnswer.textContent =
            "Your answer: " +
            (answers[index] === null
                ? "Not Answered"
                : question.options[answers[index]]);

        const correctAnswer = document.createElement("p");
        correctAnswer.textContent =
            "Correct answer: " +
            question.options[question.correct];

        const explanation = document.createElement("p");
        explanation.textContent =
            question.explanation
                ? "Explanation: " + question.explanation
                : "No explanation added.";

        item.append(
            heading,
            prompt,
            yourAnswer,
            correctAnswer,
            explanation
        );

        answerReview.appendChild(item);
    });

    document.getElementById("closeMockResult")
        .addEventListener("click", function() {

            mockResult.hidden = true;
            startMockTest.disabled = questionBank.length === 0;

            document.getElementById("mockTest")
                .scrollIntoView({ behavior: "smooth" });
        });

    mockResult.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// ==========================================
// INITIALIZE PLANNER
// ==========================================

renderDays();
updateProgress();
renderQuestionBank();


