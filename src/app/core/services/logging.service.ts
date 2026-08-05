import { Injectable } from '@angular/core';

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
  data?: any;
  stack?: string;
}

/**
 * A centralized logging service with structured log levels,
 * in-memory log buffer, and error diagnostic export capabilities.
 */
@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  private isEnabled = true;
  private maxBufferSize = 100;
  private logBuffer: LogEntry[] = [];
  private readonly STORAGE_KEY = 'app_log_buffer';

  constructor() {
    this.restoreFromStorage();
  }

  /** Central logger method */
  private addEntry(level: LogLevel, source: string, message: any, optionalParams: any[]) {
    const timestamp = new Date().toISOString();
    const formattedMessage = typeof message === 'string' ? message : JSON.stringify(message);

    let stack: string | undefined;
    let data: any;

    if (optionalParams.length > 0) {
      if (optionalParams[0] instanceof Error) {
        stack = optionalParams[0].stack;
        data = optionalParams.slice(1);
      } else if (typeof optionalParams[0] === 'object' && optionalParams[0]?.stack) {
        stack = optionalParams[0].stack;
        data = optionalParams;
      } else {
        data = optionalParams.length === 1 ? optionalParams[0] : optionalParams;
      }
    }

    const entry: LogEntry = {
      timestamp,
      level,
      source,
      message: formattedMessage,
      ...(data !== undefined ? { data } : {}),
      ...(stack ? { stack } : {}),
    };

    // Add to in-memory buffer
    this.logBuffer.push(entry);
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }

    // Console output if enabled
    if (this.isEnabled) {
      const consoleMsg = `[${timestamp}] [${level}] [${source}] ${formattedMessage}`;
      switch (level) {
        case 'DEBUG':
          console.debug(consoleMsg, data ?? '');
          break;
        case 'INFO':
          console.info(consoleMsg, data ?? '');
          break;
        case 'WARN':
          console.warn(consoleMsg, data ?? '');
          break;
        case 'ERROR':
          console.error(consoleMsg, data ?? '', stack ?? '');
          break;
      }
    }

    // Save errors and warnings to sessionStorage for diagnostic persistence
    if (level === 'ERROR' || level === 'WARN') {
      this.saveToStorage();
    }
  }

  debug(source: string, message: any, ...optionalParams: any[]) {
    this.addEntry('DEBUG', source, message, optionalParams);
  }

  info(source: string, message: any, ...optionalParams: any[]) {
    this.addEntry('INFO', source, message, optionalParams);
  }

  warn(source: string, message: any, ...optionalParams: any[]) {
    this.addEntry('WARN', source, message, optionalParams);
  }

  error(source: string, message: any, ...optionalParams: any[]) {
    this.addEntry('ERROR', source, message, optionalParams);
  }

  /** Legacy method wrapper for backward compatibility */
  log(message: any, ...optionalParams: any[]) {
    if (typeof message === 'string' && message.includes(':')) {
      const parts = message.split(':');
      this.info(parts[0].trim(), parts.slice(1).join(':').trim(), ...optionalParams);
    } else {
      this.info('App', message, ...optionalParams);
    }
  }

  /** Returns all stored logs */
  getLogs(count: number = 50): LogEntry[] {
    return this.logBuffer.slice(-count);
  }

  /** Returns stored errors only */
  getRecentErrors(count: number = 20): LogEntry[] {
    return this.logBuffer
      .filter((e) => e.level === 'ERROR')
      .slice(-count);
  }

  /** Clears accumulated log buffer */
  clearLogs() {
    this.logBuffer = [];
    try {
      sessionStorage.removeItem(this.STORAGE_KEY);
    } catch {
      // Ignore storage access errors
    }
  }

  /** Exports logs as formatted JSON string */
  exportLogsAsJson(): string {
    return JSON.stringify(this.logBuffer, null, 2);
  }

  /** Enables console output */
  enable() {
    this.isEnabled = true;
  }

  /** Disables console output */
  disable() {
    this.isEnabled = false;
  }

  private saveToStorage() {
    try {
      const recentErrors = this.getRecentErrors(20);
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(recentErrors));
    } catch {
      // Ignore storage errors (e.g. private browsing storage quota)
    }
  }

  private restoreFromStorage() {
    try {
      const saved = sessionStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as LogEntry[];
        if (Array.isArray(parsed)) {
          this.logBuffer = parsed;
        }
      }
    } catch {
      // Ignore storage restore errors
    }
  }
}