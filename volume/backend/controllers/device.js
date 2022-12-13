const { Device } = require("../models/index");

exports.addDevice = async (req, res) => {
  try {
    const result = await Device.create({
      state: true,
      work: 0,
      product: 0,
      defective: 0,
    });
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
