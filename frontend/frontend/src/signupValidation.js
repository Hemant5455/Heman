function validation(values) {
    let error = {}

    if(values.name === "") {
        error.name = 'Name should not empty'
    }else {
        error.name = "" 
    }

    if(values.email === "") {
        error.email = 'Email should not empty'
    }else {
        error.email = "" 
    }

    if(values.password === "") {
        error.password = 'Password should not empty'
    }else {
        error.password = "" 
    }

    return error
}

export default validation;