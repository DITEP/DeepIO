db.createUser({
  user: "deepIoAdmin",
  pwd: "2019Roussy",
  roles: [
    {
      role: "readWrite",
      db: "deepio",
    },
  ],
});
