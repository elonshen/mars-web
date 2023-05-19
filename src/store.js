import {reactive} from "vue";

export const snackbar = reactive({
    display: false,
    message: '',
    color: 'white',
    info(message) {
        this.display = true
        this.message = message
    }
})


