function toggleButtons(selected) {
    const ascButton = document.getElementById('ascButton');
    const descButton = document.getElementById('descButton');
    const orderInput = document.getElementById('order-input');

    if (selected === 'asc') {
        ascButton.classList.add('active');
        ascButton.classList.remove('btn-text');
        ascButton.classList.add('btn-dark');

        descButton.classList.remove('active');
        descButton.classList.add('btn-text');
        descButton.classList.remove('btn-dark');

        orderInput.value="ASC";
    } else {
        descButton.classList.add('active');
        descButton.classList.remove('btn-text');
        descButton.classList.add('btn-dark');

        ascButton.classList.remove('active');
        ascButton.classList.add('btn-text');
        ascButton.classList.remove('btn-dark');

        orderInput.value = "DESC";
    }
}

document.getElementById("filter-by").addEventListener("change", function () {
    const startDateInput = document.getElementById("start-date");
    const endDateInput = document.getElementById("end-date");
    const authorInput = document.getElementById("author-name");

    if (this.value === "author") {
        console.log("author");
        authorInput.removeAttribute("hidden");
        startDateInput.setAttribute("hidden", true);
        endDateInput.setAttribute("hidden", true);

    } else if (this.value === "date") {
        console.log("date");
        authorInput.setAttribute("hidden", true);
        startDateInput.removeAttribute("hidden");
        endDateInput.removeAttribute("hidden");
    } else {
        authorInput.setAttribute("hidden", true);
        startDateInput.setAttribute("hidden", true);
        endDateInput.setAttribute("hidden", true);
    }
});