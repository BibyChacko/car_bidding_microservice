## Middlewares
# This folder contains common middlewares for all the services 



 error_middleware -- Handles all the error thrown from the services. We are using winston to log the errors to the file error.log in    corresponding services

essential_middleware -- Contain all the essential middlewares and packages to be contained like cors,morgan. If any middleware has to be added for the services, it can be added on this file