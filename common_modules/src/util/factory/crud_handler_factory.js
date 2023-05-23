const AppError = require("../../models/app_error");

exports.deleteOne = (Model) => async (req, res, next) => {
    try {
        const doc = await Model.findByIdAndDelete(req.params.id);
        if (!doc) {
          return next(new AppError(404,"Element not found"));
        }
        return res.status(200).json({ status: true, data:doc, msg: "Deleted successfully" }); 
    } catch (error) {
        return next(new AppError(500,error.message,error.stack));
    }

};

exports.updateOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
        return next(new AppError(404,"Element not found"));
    }
    return res.status(200).json({status:true,data:doc,msg:"Data updated successfully"});
  } catch (error) {
    return next(new AppError(500,error.message,error.stack));
  }
};


exports.createOne = (Model) => async(req,res,next) => {
    try {
        const doc = await Model.create(req.body);
        if(!doc) {
            return next(new AppError(500,"Failed to create"));
        }
        return res.status(200).json({status:false,data:doc,msg:"Created successfully"});
    } catch (error) {
        return next(new AppError(500,error.message,error.stack));
    }
}

exports.readOne = (Model,populateOptions) => async (req,res,next) => {
    try {
        let query = await Model.findById(req.params.id);
        if(populateOptions) query = query.populate(populateOptions);
        const doc = await query;
        if (!doc) {
            return next(new AppError(404,"Element not found"));
        }
        return res.status(200).json({status:200,data:doc,msg:"Data fetched successfully"});
    } catch (error) {
        return next(new AppError(500,error.message,error.stack));
    }
}

exports.readMany = (Model,queryOption,populateOptions,sortOption,skip,pageSize) => async (req,res,next) => {
    try {
        let query = await Model.find(queryOption);
        if(populateOptions) query = query.populate(populateOptions);
        if(sortOption) query = query.sort(sortOption);
        if(skip) query = query.skip(skip).limit(pageSize || 15);
        const doc = await query;
        if (!doc) {
            return next(new AppError(404,"Element not found"));
        }
        return res.status(200).json({status:200,data:doc,msg:"Data fetched successfully"});
    } catch (error) {
        return next(new AppError(500,error.message,error.stack));
    }
}