const { uuid } = require("uuidv4");
module.exports = {
  async beforeCreate({ params }) {
    params.data.uid = uuid();
  },
  async beforeUpdate({ params }) {
    delete params.data.uid;
  },
  async beforeUpdateMany({ params }) {
    delete params.data.uid;
  },
};
