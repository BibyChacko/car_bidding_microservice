const AppError = require("common_modules/src/models/app_error");
const DeviceModel = require("../models/device_model");
const crudFactory = require("common_modules/src/util/factory/crud_handler_factory");

exports.addNewDevice = crudFactory.createOne(DeviceModel);

exports.updateDeviceId = async (req, res, next) => {
  const userId = req.headers.userId;
  const deviceToken = req.body.deviceToken;
  try {
    const updatedDeviceModel = await DeviceModel.findOneAndUpdate(
      { userId: userId },
      { deviceToken: deviceToken }
    );
    return res
      .status(200)
      .json({ status: true, msg: "Device token updated successfully" });
  } catch (error) {
    return next(new AppError(500, error.message, ex.stacktrace));
  }
};
