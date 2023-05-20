function validation(values) {
    let error = {}

    if(values.email === "") {
        error.email = 'Name should not empty'
    }else {
        error.email = "" 
    }

    if(values.password === "") {
        error.password = 'Password should not empty'
    }else {
        error.email = "" 
    }

    return error
}

export default validation;