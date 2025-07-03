import mockSettings from '@/services/mockData/settings.json'

class SettingsService {
  constructor() {
    this.settings = { ...mockSettings }
  }

  async getSettings() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return { ...this.settings }
  }

  async updateSettings(newSettings) {
    await new Promise(resolve => setTimeout(resolve, 400))
    this.settings = { ...this.settings, ...newSettings }
    return { ...this.settings }
  }

  async resetSettings() {
    await new Promise(resolve => setTimeout(resolve, 300))
    this.settings = { ...mockSettings }
    return { ...this.settings }
  }
}

export const settingsService = new SettingsService()