define(function() {
    let data = {};
    function dataPerson() {
        fetch("https://tensor-school.herokuapp.com/user/current", {
            credentials: 'include'
        })
            .then(response => response.json())
            .then(result => {
                data = result.data.data;
                console.log(data)
            })
            .catch(error => console.log('error', error));
    }
    return dataPerson;
})
