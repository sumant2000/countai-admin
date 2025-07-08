// Auto-fill utilities for worker authentication demo
export interface WorkerProfile {
  id: string
  name: string
  department: string
  shift: string
}

// Enhanced sample worker data with more realistic profiles
export const SAMPLE_WORKERS: WorkerProfile[] = [
  { id: "W1001", name: "John Smith", department: "Quality Control", shift: "Morning" },
  { id: "W1002", name: "Sarah Johnson", department: "Production", shift: "Evening" },
  { id: "W1003", name: "Mike Wilson", department: "Packaging", shift: "Night" },
  { id: "W1004", name: "Emma Davis", department: "Quality Control", shift: "Morning" },
  { id: "W1005", name: "David Brown", department: "Maintenance", shift: "Day" },
  { id: "W1006", name: "Lisa Garcia", department: "Production", shift: "Evening" },
  { id: "W1007", name: "Chris Miller", department: "Logistics", shift: "Morning" },
  { id: "W1008", name: "Anna Taylor", department: "Quality Control", shift: "Night" },
  { id: "W1009", name: "James Moore", department: "Production", shift: "Day" },
  { id: "W1010", name: "Maria Rodriguez", department: "Packaging", shift: "Evening" },
  { id: "W1011", name: "Robert Lee", department: "Maintenance", shift: "Morning" },
  { id: "W1012", name: "Jennifer White", department: "Quality Control", shift: "Day" },
  { id: "W1013", name: "Michael Clark", department: "Production", shift: "Night" },
  { id: "W1014", name: "Jessica Martinez", department: "Logistics", shift: "Morning" },
  { id: "W1015", name: "William Lopez", department: "Packaging", shift: "Evening" }
]

export class WorkerAutoFill {
  /**
   * Generate a random worker ID in format W#### (W + 4 digits)
   */
  static generateWorkerId(): string {
    const randomNum = Math.floor(Math.random() * 9000) + 1000
    return `W${randomNum}`
  }

  /**
   * Get a random worker name from the sample list
   */
  static getRandomWorkerName(): string {
    const randomWorker = SAMPLE_WORKERS[Math.floor(Math.random() * SAMPLE_WORKERS.length)]
    return randomWorker.name
  }

  /**
   * Get a complete random worker profile
   */
  static getRandomWorkerProfile(): WorkerProfile {
    return SAMPLE_WORKERS[Math.floor(Math.random() * SAMPLE_WORKERS.length)]
  }

  /**
   * Get a worker profile by ID, or generate a random one if not found
   */
  static getWorkerProfileById(id: string): WorkerProfile {
    const found = SAMPLE_WORKERS.find(worker => worker.id === id)
    if (found) return found

    // Generate a profile for custom IDs
    return {
      id,
      name: this.getRandomWorkerName(),
      department: this.getRandomDepartment(),
      shift: this.getRandomShift()
    }
  }

  /**
   * Generate a realistic worker name combination
   */
  static generateRealisticWorkerName(): string {
    const firstNames = [
      "John", "Sarah", "Mike", "Emma", "David", "Lisa", "Chris", "Anna", 
      "James", "Maria", "Robert", "Jennifer", "Michael", "Jessica", "William",
      "Ashley", "Daniel", "Amanda", "Ryan", "Lauren", "Kevin", "Nicole", "Brian"
    ]
    
    const lastNames = [
      "Smith", "Johnson", "Wilson", "Davis", "Brown", "Garcia", "Miller", 
      "Taylor", "Moore", "Rodriguez", "Lee", "White", "Clark", "Martinez", "Lopez",
      "Anderson", "Thomas", "Jackson", "Thompson", "Harris", "Martin", "Walker"
    ]

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    
    return `${firstName} ${lastName}`
  }

  private static getRandomDepartment(): string {
    const departments = ["Quality Control", "Production", "Packaging", "Maintenance", "Logistics"]
    return departments[Math.floor(Math.random() * departments.length)]
  }

  private static getRandomShift(): string {
    const shifts = ["Morning", "Day", "Evening", "Night"]
    return shifts[Math.floor(Math.random() * shifts.length)]
  }

  /**
   * Quick demo credentials for testing
   */
  static getDemoCredentials(): { id: string; name: string } {
    const profile = this.getRandomWorkerProfile()
    return {
      id: profile.id,
      name: profile.name
    }
  }

  /**
   * Get preset demo users for consistent testing
   */
  static getPresetDemoUsers(): WorkerProfile[] {
    return [
      { id: "W1001", name: "John Smith", department: "Quality Control", shift: "Morning" },
      { id: "W1002", name: "Sarah Johnson", department: "Production", shift: "Evening" },
      { id: "W1003", name: "Mike Wilson", department: "Packaging", shift: "Night" },
      { id: "ADMIN", name: "Admin User", department: "Management", shift: "All" },
      { id: "DEMO", name: "Demo User", department: "Testing", shift: "Demo" }
    ]
  }
}
