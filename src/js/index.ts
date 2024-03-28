const generate_on_input: NodeListOf<HTMLInputElement> = document.querySelectorAll(".generate_on_input") as NodeListOf<HTMLInputElement>;
const textarea: HTMLTextAreaElement = document.querySelector("textarea") as HTMLTextAreaElement;
const slider_length: HTMLInputElement = document.querySelector("#length") as HTMLInputElement;
const length_indicator: HTMLSpanElement = document.querySelector("#length_indicator") as HTMLSpanElement;
const numbers_checkbox: HTMLInputElement = document.querySelector("#numbers") as HTMLInputElement;
const lower_case_checkbox: HTMLInputElement = document.querySelector("#lower_case") as HTMLInputElement;
const upper_case_checkbox: HTMLInputElement = document.querySelector("#upper_case") as HTMLInputElement;
const special_characters_checkbox: HTMLInputElement = document.querySelector("#special_characters") as HTMLInputElement;
const ambigous_characters: HTMLInputElement = document.querySelector("#ambigous_characters") as HTMLInputElement;
const generate_button: HTMLButtonElement = document.querySelector("#generate") as HTMLButtonElement;
const copy_to_clipboard_button: HTMLButtonElement = document.querySelector("#copy_to_clipboard") as HTMLButtonElement;
const tooltip: HTMLElement = document.querySelector(".tooltip") as HTMLElement;

/*
All printable ascii characters except " (space).
In sum, this are 10+26+26+32=94 characters.
*/
const ascii = {
    numbers: "0123456789",
    lower_case: "abcdefghijklmnopqrstuvwxyz",
    upper_case: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    spacial_characters: "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~",
};

/**
 * Reduced by slightly ambigous and problematic characters:
 * 01
 * l
 * IOQ
 * \"$'(),./:;=[\]^`{|}~
 */
const ascii_reduced = {
    numbers: "23456789",
    lower_case: "abcdefghijkmnopqrstuvwxyz",
    upper_case: "ABCDEFGHJKLMNPRSTUVWXYZ",
    spacial_characters: "!#%&+-=?@_",
};

/**
 * shuffel an array
 * Durstenfeld shuffel
 * reference: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array/12646864#12646864
 */
function shuffle_string(s: string) {
    let s_array = s.split("");
    for (let i = s_array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [s_array[i], s_array[j]] = [s_array[j], s_array[i]];
    }
    return s_array.join("");
}


/**
 * Getting a random integer between two values, inclusive
 * @param min minimum number, inclusive
 * @param max maximum number, inclusive
 * @returns random number
 * Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values_inclusive
 */
function get_random_int(min: number, max: number): number {
    const min_ceiled = Math.ceil(min);
    const max_floored = Math.floor(max);
    return Math.floor(Math.random() * (max_floored - min_ceiled + 1) + min_ceiled);
}


/**
 * Gets a random string of an array of strings.
 * @param strings Array of strings
 * @returns A single string
 */
function get_random_character(s: string): string {
    return s[get_random_int(0, s.length - 1)];
}


function generate_password(length: number, numbers: boolean, lower_case: boolean, upper_case: boolean, spacial_characters: boolean, ambigous: boolean) {
    if (!numbers && !lower_case && !upper_case && !spacial_characters) {
        return "lol";
    }
    let base: { [key: string]: string } = {};
    if (ambigous) {
        base = ascii;
    } else {
        base = ascii_reduced;
    }
    let password = "";
    let characters: string = "";
    // If a character group is selected inculde it at least once.
    if (numbers) {
        characters += base.numbers;
        password += get_random_character(base.numbers);
    }
    if (lower_case) {
        characters += base.lower_case;
        password += get_random_character(base.lower_case);
    }
    if (upper_case) {
        characters += base.upper_case;
        password += get_random_character(base.upper_case);
    }
    if (spacial_characters) {
        characters += base.spacial_characters;
        password += get_random_character(base.spacial_characters);
    }
    // Fill the password with the remaining characters.
    for (let i = password.length + 1; i <= length; i++) {
        password += get_random_character(characters);
    }
    // Shuffel the password, so that the garanteed to be included characters not necessary the first.
    password = shuffle_string(password);
    return password;
}


function generate() {
    let length = parseInt(slider_length.value);
    let numbers = numbers_checkbox.checked;
    let lower_case = lower_case_checkbox.checked;
    let upper_case = upper_case_checkbox.checked;
    let special_characters = special_characters_checkbox.checked;
    let ambigous = ambigous_characters.checked;
    textarea.textContent = generate_password(length, numbers, lower_case, upper_case, special_characters, ambigous);
}

window.addEventListener("load", (event) => {
    generate();
});

for (let element of generate_on_input) {
    element.addEventListener("input", (event) => {
        generate();
    })
}

slider_length.addEventListener("input", (event) => {
    length_indicator.innerText = slider_length.value;
});

generate_button.addEventListener("click", (event) => {
    generate();
});

copy_to_clipboard_button.addEventListener("click", async (event) => {
    try {
        await navigator.clipboard.writeText(textarea.textContent as string);
        tooltip.classList.toggle("hidden");
        setTimeout(() => tooltip.classList.add("hidden"), 2000);
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
});
