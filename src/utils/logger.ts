import morgan from "morgan";

// Putting this in its dedicated file incase we need to do more than logging (like sending it to datadog or something)
const logger = morgan("tiny");

export default logger;
