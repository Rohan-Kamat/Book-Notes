var addReviewBtn = document.getElementById("add-review");
if (addReviewBtn) {
    addReviewBtn.addEventListener("click", function (e) {
        document.getElementById("review-form").removeAttribute("hidden");
        document.getElementById("no-review").setAttribute("hidden", true);
    })
}

document.getElementById("edit-review").addEventListener("click", function (){
    document.getElementById("edit-review-form").removeAttribute("hidden");
    document.getElementById("review-text").setAttribute("hidden", true);
});

document.getElementById("edit-review-cancel").addEventListener("click", function () {
    document.getElementById("review-text").removeAttribute("hidden");
    document.getElementById("edit-review-form").setAttribute("hidden", true);
})

document.getElementById("add-note").addEventListener("click", function (e) {
    document.getElementById("note-form").removeAttribute("hidden");
});

var editNoteList = document.querySelectorAll(".edit-note");
editNoteList.forEach(element => {
    element.addEventListener("click", function () {
        var noteId = this.id;
        document.getElementById("note-" + noteId).setAttribute("hidden", true);
        document.getElementById("edit-note-" + noteId + "-form").removeAttribute("hidden");
    })
});

document.querySelectorAll(".edit-note-form").forEach(element => {
    element.addEventListener("reset", function (e) {
        e.preventDefault();
        var noteId = this.id.split("-")[2];
        document.getElementById("edit-note-" + noteId + "-form").setAttribute("hidden", true);
        document.getElementById("note-" + noteId).removeAttribute("hidden");
    })
});