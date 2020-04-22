define(function() {
    function dataPerson() {
        fetch("https://tensor-school.herokuapp.com/user/current")
            .then(response => {
                console.log(response)
            })
            .catch(error => console.log('error', error));
    }
    return dataPerson;
})
