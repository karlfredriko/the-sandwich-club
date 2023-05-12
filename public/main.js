const confirmDelete = () => {
  if (confirm("Are you sure you want to delete this user?")) {
    document.querySelector("#deleteBtn").submit();
  }
};
