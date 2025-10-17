document.getElementById('todoListButtonCopyDB').addEventListener('click', ()=>
{
    navigator.clipboard
      .writeText(JSON.stringify(TODOStorage.getTaskById(null)))
      .then(() => {
        alert("successfully copied");
      })
      .catch(() => {
        alert("something went wrong");
      });
});

document.getElementById('todoListButtonImportDB').addEventListener('click', ()=>
{
    const res = prompt("Вставьте БД");
    if(res)
        TODOStorage.importDB(res);
});