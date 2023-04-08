(() => {
    "use strict";
    const modules_flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    function formFieldsInit(options = {
        viewPass: false,
        autoHeight: false
    }) {
        const formFields = document.querySelectorAll("input[placeholder],textarea[placeholder]");
        if (formFields.length) formFields.forEach((formField => {
            if (!formField.hasAttribute("data-placeholder-nohide")) formField.dataset.placeholder = formField.placeholder;
        }));
        document.body.addEventListener("focusin", (function(e) {
            const targetElement = e.target;
            if ("INPUT" === targetElement.tagName || "TEXTAREA" === targetElement.tagName) {
                if (targetElement.dataset.placeholder) targetElement.placeholder = "";
                if (!targetElement.hasAttribute("data-no-focus-classes")) {
                    targetElement.classList.add("_form-focus");
                    targetElement.parentElement.classList.add("_form-focus");
                }
                formValidate.removeError(targetElement);
            }
        }));
        document.body.addEventListener("focusout", (function(e) {
            const targetElement = e.target;
            if ("INPUT" === targetElement.tagName || "TEXTAREA" === targetElement.tagName) {
                if (targetElement.dataset.placeholder) targetElement.placeholder = targetElement.dataset.placeholder;
                if (!targetElement.hasAttribute("data-no-focus-classes")) {
                    targetElement.classList.remove("_form-focus");
                    targetElement.parentElement.classList.remove("_form-focus");
                }
                if (targetElement.hasAttribute("data-validate")) formValidate.validateInput(targetElement);
            }
        }));
        if (options.viewPass) document.addEventListener("click", (function(e) {
            let targetElement = e.target;
            if (targetElement.closest('[class*="__viewpass"]')) {
                let inputType = targetElement.classList.contains("_viewpass-active") ? "password" : "text";
                targetElement.parentElement.querySelector("input").setAttribute("type", inputType);
                targetElement.classList.toggle("_viewpass-active");
            }
        }));
        if (options.autoHeight) {
            const textareas = document.querySelectorAll("textarea[data-autoheight]");
            if (textareas.length) {
                textareas.forEach((textarea => {
                    const startHeight = textarea.hasAttribute("data-autoheight-min") ? Number(textarea.dataset.autoheightMin) : Number(textarea.offsetHeight);
                    const maxHeight = textarea.hasAttribute("data-autoheight-max") ? Number(textarea.dataset.autoheightMax) : 1 / 0;
                    setHeight(textarea, Math.min(startHeight, maxHeight));
                    textarea.addEventListener("input", (() => {
                        if (textarea.scrollHeight > startHeight) {
                            textarea.style.height = `auto`;
                            setHeight(textarea, Math.min(Math.max(textarea.scrollHeight, startHeight), maxHeight));
                        }
                    }));
                }));
                function setHeight(textarea, height) {
                    textarea.style.height = `${height}px`;
                }
            }
        }
    }
    let formValidate = {
        getErrors(form) {
            let error = 0;
            let formRequiredItems = form.querySelectorAll("*[data-required]");
            if (formRequiredItems.length) formRequiredItems.forEach((formRequiredItem => {
                if ((null !== formRequiredItem.offsetParent || "SELECT" === formRequiredItem.tagName) && !formRequiredItem.disabled) error += this.validateInput(formRequiredItem);
            }));
            return error;
        },
        validateInput(formRequiredItem) {
            let error = 0;
            if ("email" === formRequiredItem.dataset.required) {
                formRequiredItem.value = formRequiredItem.value.replace(" ", "");
                if (this.emailTest(formRequiredItem)) {
                    this.addError(formRequiredItem);
                    error++;
                } else this.removeError(formRequiredItem);
            } else if ("checkbox" === formRequiredItem.type && !formRequiredItem.checked) {
                this.addError(formRequiredItem);
                error++;
            } else if (!formRequiredItem.value.trim()) {
                this.addError(formRequiredItem);
                error++;
            } else this.removeError(formRequiredItem);
            return error;
        },
        addError(formRequiredItem) {
            formRequiredItem.classList.add("_form-error");
            formRequiredItem.parentElement.classList.add("_form-error");
            let inputError = formRequiredItem.parentElement.querySelector(".form__error");
            if (inputError) formRequiredItem.parentElement.removeChild(inputError);
            if (formRequiredItem.dataset.error) formRequiredItem.parentElement.insertAdjacentHTML("beforeend", `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
        },
        removeError(formRequiredItem) {
            formRequiredItem.classList.remove("_form-error");
            formRequiredItem.parentElement.classList.remove("_form-error");
            if (formRequiredItem.parentElement.querySelector(".form__error")) formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector(".form__error"));
        },
        formClean(form) {
            form.reset();
            setTimeout((() => {
                let inputs = form.querySelectorAll("input,textarea");
                for (let index = 0; index < inputs.length; index++) {
                    const el = inputs[index];
                    el.parentElement.classList.remove("_form-focus");
                    el.classList.remove("_form-focus");
                    formValidate.removeError(el);
                }
                let checkboxes = form.querySelectorAll(".checkbox__input");
                if (checkboxes.length > 0) for (let index = 0; index < checkboxes.length; index++) {
                    const checkbox = checkboxes[index];
                    checkbox.checked = false;
                }
                if (modules_flsModules.select) {
                    let selects = form.querySelectorAll(".select");
                    if (selects.length) for (let index = 0; index < selects.length; index++) {
                        const select = selects[index].querySelector("select");
                        modules_flsModules.select.selectBuild(select);
                    }
                }
            }), 0);
        },
        emailTest(formRequiredItem) {
            return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
        }
    };
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    const DayError = document.querySelector(".day-error");
    const MonthError = document.querySelector(".month-error");
    const YearError = document.querySelector(".year-error");
    const YearResult = document.querySelector(".year-result");
    const MonthResult = document.querySelector(".month-result");
    const DayResult = document.querySelector(".day-result");
    const SubmitBtn = document.querySelector(".form__button");
    const InputDay = document.querySelector(".day");
    const InputMonth = document.querySelector(".month");
    const InputYear = document.querySelector(".year");
    const InputRequiredError = "This field is required";
    const InputDayError = "Must be a valid day";
    const InputMonthError = "Must be a valid month";
    const InputYearError = "Must be in the past";
    const canvas = document.getElementById("canvas");
    const confetti = new ConfettiGenerator({
        target: canvas
    });
    confetti.render();
    function CheckDayInput() {
        let value = InputDay.value;
        if ("" == value) {
            DayError.innerHTML = InputRequiredError;
            InputDay.classList.add("_form-error");
            return false;
        } else if (value < 1 || value > 31) {
            DayError.innerHTML = InputDayError;
            InputDay.classList.add("_form-error");
            return false;
        } else {
            DayError.innerHTML = "";
            InputDay.classList.remove("_form-error");
            return true;
        }
    }
    function CheckMonthInput() {
        let value = InputMonth.value;
        if ("" == value) {
            MonthError.innerHTML = InputRequiredError;
            InputMonth.classList.add("_form-error");
            return false;
        } else if (value < 1 || value > 31) {
            MonthError.innerHTML = InputMonthError;
            InputMonth.classList.add("_form-error");
            return false;
        } else {
            MonthError.innerHTML = "";
            InputMonth.classList.remove("_form-error");
            return true;
        }
    }
    function CheckYearInput() {
        let value = InputYear.value;
        let currentYear = (new Date).getFullYear();
        console.log(currentYear);
        if ("" == value) {
            YearError.innerHTML = InputRequiredError;
            InputYear.classList.add("_form-error");
            return false;
        } else if (value > currentYear) {
            YearError.innerHTML = InputYearError;
            InputYear.classList.add("_form-error");
            return false;
        } else {
            YearError.innerHTML = "";
            InputYear.classList.remove("_form-error");
            return true;
        }
    }
    function calculateAge(birthday) {
        birthday = new Date(birthday);
        var today = new Date;
        var years = today.getFullYear() - birthday.getFullYear();
        var months = today.getMonth() - birthday.getMonth();
        var days = today.getDay() - birthday.getDay();
        if (months < 0 || 0 === months && days < 0) {
            years--;
            if (0 === months) months = 11; else months = 12 + months;
            days = 30 + days;
        }
        YearResult.innerHTML = years;
        MonthResult.innerHTML = months;
        DayResult.innerHTML = days;
    }
    SubmitBtn.addEventListener("click", (function(e) {
        e.preventDefault();
        let day = CheckDayInput();
        let month = CheckMonthInput();
        let year = CheckYearInput();
        if (!day || !month || !year) return;
        let birthday = `${InputMonth.value}/${InputDay.value}/${InputYear.value}`;
        calculateAge(birthday);
        canvas.style.display = "block";
        setTimeout((function() {
            canvas.style.display = "none";
        }), 8e3);
    }));
    window["FLS"] = true;
    isWebp();
    formFieldsInit({
        viewPass: false,
        autoHeight: false
    });
})();