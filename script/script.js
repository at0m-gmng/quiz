document.addEventListener('DOMContentLoaded', function () {
    // 'use strict';    
    const  btnOpenModal = document.querySelector('#btnOpenModal');
    const modalBlock = document.querySelector('#modalBlock');
    const modalTitle = document.querySelector('.modal-title');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const burgerBtn = document.getElementById('burger');
    const nextButton = document.querySelector('#next');
    const prevButton = document.querySelector('#prev');
    const sendButton = document.querySelector('#send');
    const modalDialog = document.querySelector('.modal-dialog');
    //функция получения данных
    const getData = () => {
        formAnswers.textContent = 'LOAD';
        setTimeout(()=> {
            fetch('questions.json')
            .then(res => res.json())
            .then(obj => playTest(obj.questions))
            .catch(err => {
                formAnswers.textContent = 'Ошибка загрузки данных!';
                console.error(err);
            });
        }, 300);
    };

    let count =  -100;
    modalDialog.style.top = count + "%";
    const animateModal = () => {
        modalDialog.style.top = count + "%";
        count+=3;

        if(count < 0){
            requestAnimationFrame(animateModal);
        } else {
            count =  -100;
        }
    };

    let clientWidth = document.documentElement.clientWidth;
    if (clientWidth <= 768){
        burgerBtn.style.display = 'd-flex';   
    } else {
        burgerBtn.style.display = 'd-none';
    }

    window.addEventListener('resize', function () {
        clientWidth = document.documentElement.clientWidth;
        if (clientWidth <= 768){
            burgerBtn.style.display = 'd-flex';   
        } else {
            burgerBtn.style.display = 'd-none';
        }
    });

    burgerBtn.addEventListener('click',  () => { 
        requestAnimationFrame(animateModal);
        burgerBtn.classList.add('active');
        modalBlock.classList.add('d-block');
        getData();
    }); 

    //Открытие - закрытие модального окна
    btnOpenModal.addEventListener('click', () => {
        requestAnimationFrame(animateModal);
        burgerBtn.classList.add('active');
        modalBlock.classList.add('d-block');
        getData();
    });
    closeModal.addEventListener('click', () => {
        modalBlock.classList.remove('d-block');
        burgerBtn.classList.remove('active');
    });

    document.addEventListener('click', function (event) {
    if(
        !event.target.closest('.modal-dialog') && 
        !event.target.closest('.openModalButton') && 
        !event.target.closest('.burger')
    ) {
        modalBlock.classList.remove('d-block');
        burgerBtn.classList.remove('active');
    }
    });
    //Запуск функции тестирования
    const playTest = (questions) => {
        const finalAnswers = [];
        const obj = {};
        let numberQuestion = 0;//Номер вопроса
        //перебор объекта с вопросами и рендеринг ответов 
        const renderAnswers = (index) => {
            questions[index].answers.forEach((answer) => {
                // чтобы блоки не перезаписывались, мы создаём каждый раз новый и ему передаём вёрстку
                const answerItem = document.createElement('div');
                answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');
                answerItem.innerHTML = `
                    <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none" value="${answer.title}">
                    <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                    <img class="answerImg" src="${answer.url}" alt="burger">
                    <span>${answer.title}</span>
                    </label>
                `;   
                formAnswers.appendChild(answerItem);         
            })
        };
        //функция рендеринка вопросов и ответов
        const renderQuestions = (indexQuestion) => {
            formAnswers.innerHTML = '';

            switch(true){
                case (numberQuestion >= 0 && numberQuestion <= (questions.length - 1)):
                    questionTitle.textContent = `${questions[indexQuestion].question}`;
                    renderAnswers(indexQuestion);
                    nextButton.classList.remove('d-none');
                    prevButton.classList.remove('d-none');
                    sendButton.classList.add('d-none');
                    break;
                case (numberQuestion === 0):
                    prevButton.classList.add('d-none');
                    break;
                case(numberQuestion  === questions.length):
                    questionTitle.textContent = '';
                    modalTitle.textContent = '';
                    nextButton.classList.add('d-none');
                    prevButton.classList.add('d-none');
                    sendButton.classList.remove('d-none');

                    formAnswers.innerHTML = `
                        <div class="form-group>
                            <label for="exampleInputPassword1">Введите номер телефона</label>
                            <input type="phone" class="form-control" id="numberPhone">
                        </div>
                    `;
                    const numberPhone = document.getElementById('numberPhone');
                    numberPhone.addEventListener('input', (event) =>{
                        event.target.value = event.target.value.replace(/[^0-9+-]/, '');
                    });
                    break;
                case(numberQuestion  === (questions.length + 1 )):
                    sendButton.classList.add('d-none');
                    formAnswers.textContent = 'Спасибо за пройденный тест!';
                    for(let key in obj){
                        let newObj = {};
                        newObj[key] = obj[key];
                        finalAnswers.push(newObj);
                    }
                    console.log(finalAnswers);
                    setTimeout(() => {
                        modalBlock.classList.remove('d-block');
                    }, 2000);
                    break;
                default:
                    console.log('none');
            }
        };
        renderQuestions(numberQuestion);//запуск рендеринга

        const checkAnswer = () => {
        
            const inputs = [...formAnswers.elements].filter((input) => input.checked || input.id === 'numberPhone');

            inputs.forEach((input, index) => {
                if(numberQuestion >= 0 && numberQuestion <= (questions.length - 1) ){
                    obj[`${index}_${questions[numberQuestion].question}`] = input.value;
                }
                if(numberQuestion === questions.length ){
                    obj['Номер телефона'] = input.value;
                }
            });
        };

        //обработчики событий на кнопки, меняем вопросы
        nextButton.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
        };
        prevButton.onclick = () => {
            numberQuestion--;
            renderQuestions(numberQuestion);
        };
        sendButton.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
            // questions.database().child('contacts').push(finalAnswers);
        };
    };

});

