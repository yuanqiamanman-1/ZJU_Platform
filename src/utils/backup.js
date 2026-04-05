import api from '../services/api';

/**
 * 数据备份和恢复工具
 */

class BackupManager {
  constructor() {
    this.backupKey = 'app_backup';
    this.autoBackupInterval = 300000; // 5 分钟
    this.maxBackups = 10;
    this.backupHistory = [];
  }

  /**
   * 创建数据备份
   * @param {Object} data - 要备份的数据
   * @param {string} type - 备份类型
   * @returns {string} 备份 ID
   */
  async createBackup(data, type = 'manual') {
    const backup = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      type,
      data,
      version: '1.0.0',
      checksum: await this.calculateChecksum(data)
    };

    // 保存到本地存储
    this.saveToLocalStorage(backup);

    // 保存到服务器
    await this.saveToServer(backup);

    // 更新备份历史
    this.backupHistory.unshift({
      id: backup.id,
      timestamp: backup.timestamp,
      type,
      size: JSON.stringify(data).length
    });

    // 限制备份数量
    if (this.backupHistory.length > this.maxBackups) {
      this.cleanupOldBackups();
    }

    console.log('[Backup] Created backup:', backup.id);
    return backup.id;
  }

  /**
   * 从备份恢复数据
   * @param {string} backupId - 备份 ID
   * @returns {Object|null} 恢复的数据
   */
  async restoreBackup(backupId) {
    try {
      // 从本地存储恢复
      const localBackup = this.getFromLocalStorage(backupId);
      if (localBackup && (await this.verifyChecksum(localBackup))) {
        console.log('[Backup] Restored from local:', backupId);
        return localBackup.data;
      }

      // 从服务器恢复
      const serverBackup = await this.getFromServer(backupId);
      if (serverBackup && (await this.verifyChecksum(serverBackup))) {
        console.log('[Backup] Restored from server:', backupId);
        return serverBackup.data;
      }

      console.error('[Backup] Failed to restore:', backupId);
      return null;
    } catch (error) {
      console.error('[Backup] Restore error:', error);
      return null;
    }
  }

  /**
   * 获取备份历史
   * @returns {Array} 备份历史列表
   */
  getBackupHistory() {
    return this.backupHistory;
  }

  /**
   * 删除备份
   * @param {string} backupId - 备份 ID
   */
  async deleteBackup(backupId) {
    // 从本地存储删除
    const backups = JSON.parse(localStorage.getItem(this.backupKey) || '{}');
    delete backups[backupId];
    localStorage.setItem(this.backupKey, JSON.stringify(backups));

    // 从服务器删除
    try {
      await api.delete(`/backups/${backupId}`, { silent: true });
    } catch (error) {
      // 忽略错误
    }

    // 更新历史
    this.backupHistory = this.backupHistory.filter(b => b.id !== backupId);

    console.log('[Backup] Deleted backup:', backupId);
  }

  /**
   * 导出备份为文件
   * @param {string} backupId - 备份 ID
   */
  exportBackup(backupId) {
    const backup = this.getFromLocalStorage(backupId);
    if (!backup) {
      console.error('[Backup] Backup not found:', backupId);
      return;
    }

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-${backupId}-${new Date(backup.timestamp).toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('[Backup] Exported backup:', backupId);
  }

  /**
   * 从文件导入备份
   * @param {File} file - 备份文件
   * @returns {Promise<Object>} 导入的备份数据
   */
  async importBackup(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const backup = JSON.parse(event.target.result);
          
          // 验证备份格式
          if (!backup.id || !backup.timestamp || !backup.data) {
            throw new Error('Invalid backup format');
          }

          // 保存到本地存储
          this.saveToLocalStorage(backup);

          // 添加到历史
          this.backupHistory.unshift({
            id: backup.id,
            timestamp: backup.timestamp,
            type: 'imported',
            size: JSON.stringify(backup.data).length
          });

          console.log('[Backup] Imported backup:', backup.id);
          resolve(backup);
        } catch (error) {
          console.error('[Backup] Import error:', error);
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  /**
   * 自动备份
   */
  startAutoBackup(callback) {
    this.autoBackupTimer = setInterval(async () => {
      try {
        const data = await callback();
        if (data) {
          await this.createBackup(data, 'auto');
        }
      } catch (error) {
        console.error('[Backup] Auto backup failed:', error);
      }
    }, this.autoBackupInterval);

    console.log('[Backup] Started auto backup');
  }

  /**
   * 停止自动备份
   */
  stopAutoBackup() {
    if (this.autoBackupTimer) {
      clearInterval(this.autoBackupTimer);
      console.log('[Backup] Stopped auto backup');
    }
  }

  /**
   * 生成唯一 ID
   */
  generateId() {
    return `backup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 计算数据校验和
   */
  async calculateChecksum(data) {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  /**
   * 验证校验和
   */
  async verifyChecksum(backup) {
    const checksum = await this.calculateChecksum(backup.data);
    return checksum === backup.checksum;
  }

  /**
   * 保存到本地存储
   */
  saveToLocalStorage(backup) {
    const backups = JSON.parse(localStorage.getItem(this.backupKey) || '{}');
    backups[backup.id] = backup;
    localStorage.setItem(this.backupKey, JSON.stringify(backups));
  }

  /**
   * 从本地存储获取
   */
  getFromLocalStorage(backupId) {
    const backups = JSON.parse(localStorage.getItem(this.backupKey) || '{}');
    return backups[backupId];
  }

  /**
   * 保存到服务器
   */
  async saveToServer(backup) {
    try {
      await api.post('/backups', backup, { silent: true });
    } catch (error) {
      console.warn('[Backup] Failed to save to server:', error);
      // 本地备份仍然有效
    }
  }

  /**
   * 从服务器获取
   */
  async getFromServer(backupId) {
    try {
      const response = await api.get(`/backups/${backupId}`, { silent: true });
      return response.data;
    } catch (error) {
      return null;
    }
  }

  /**
   * 清理旧备份
   */
  cleanupOldBackups() {
    const toDelete = this.backupHistory.slice(this.maxBackups);
    toDelete.forEach(backup => this.deleteBackup(backup.id));
  }
}

// 创建单例
const backupManager = new BackupManager();

export default backupManager;
