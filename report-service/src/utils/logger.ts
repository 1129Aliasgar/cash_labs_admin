export class Logger {
  static info(message: string, meta?: unknown) {
    if (meta !== undefined) {
      console.log(`[INFO] ${new Date().toISOString()} ${message}`, meta);
      return;
    }
    console.log(`[INFO] ${new Date().toISOString()} ${message}`);
  }

  static warn(message: string, meta?: unknown) {
    if (meta !== undefined) {
      console.warn(`[WARN] ${new Date().toISOString()} ${message}`, meta);
      return;
    }
    console.warn(`[WARN] ${new Date().toISOString()} ${message}`);
  }

  static error(message: string, meta?: unknown) {
    if (meta !== undefined) {
      console.error(`[ERROR] ${new Date().toISOString()} ${message}`, meta);
      return;
    }
    console.error(`[ERROR] ${new Date().toISOString()} ${message}`);
  }
}

