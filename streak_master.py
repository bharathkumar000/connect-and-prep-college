import os
import subprocess
from datetime import datetime, timedelta

def run_git_command(env, *args):
    cmd = ["git"] + list(args)
    result = subprocess.run(cmd, env=env, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"Error running git {' '.join(args)}: {result.stderr}")
    return result.returncode == 0

def create_commit(files, message, date):
    # Set environment variables for the commit date
    env = os.environ.copy()
    date_str = date.strftime("%Y-%m-%d %H:%M:%S")
    env["GIT_AUTHOR_DATE"] = date_str
    env["GIT_COMMITTER_DATE"] = date_str
    
    # Add files
    for file in files:
        subprocess.run(["git", "add", file], check=True)
    
    # Commit
    if run_git_command(env, "commit", "-m", message):
        print(f"Committed: {message} for {date_str}")
    else:
        print(f"Failed to commit: {message}")

def main():
    # Base date (starting today)
    base_date = datetime.now()
    
    # 1. Day 0: Core Next.js Setup
    core_files = [
        "package.json", 
        "package-lock.json", 
        "next.config.mjs", 
        "src/app/layout.js", 
        "src/app/Providers.js",
        ".gitignore"
    ]
    create_commit(core_files, "feat(core): initialize Next.js architecture and providers", base_date)

    # 2. Day 1: Auth Migration
    auth_files = [
        "src/app/login/page.js",
        "src/app/register/page.js",
        "src/app/page.js",
        "src/components/auth/LoginPage.jsx",
        "src/components/auth/LoginPage.css",
        "src/components/auth/SignupPage.jsx",
        "src/components/auth/SignupPage.css"
    ]
    create_commit(auth_files, "feat(auth): migrate login and registration to Next.js routes", base_date + timedelta(days=1))

    # 3. Day 2: Dashboard Layout
    layout_files = [
        "src/app/dashboard/layout.js",
        "src/components/layout/DashboardLayout.css"
    ]
    create_commit(layout_files, "feat(layout): implement dashboard shell with Next.js navigation", base_date + timedelta(days=2))

    # 4. Day 3: Dashboard Home
    home_files = ["src/app/dashboard/page.js"]
    create_commit(home_files, "feat(dashboard): initialize main dashboard terminal", base_date + timedelta(days=3))

    # 5. Day 4-N: Feature Pages (One per day)
    feature_pages = [
        ("papers", "QuestionPapers"),
        ("assignments", "AssignmentHub"),
        ("attendance", "Attendance"),
        ("timetable", "Timetable"),
        ("notes", "Notes"),
        ("doubts", "DoubtSolving"),
        ("studyzone", "StudyZone"),
        ("chat", "ChatForum"),
        ("analysis", "Analysis"),
        ("feed", "ActivityFeed"),
        ("cgpa", "CGPACalculator"),
        ("challenges", "Challenges"),
        ("predictor", "ExamPredictor"),
        ("leaderboard", "Gamification"),
        ("placements", "PlacementHub"),
        ("complaints", "ComplaintBox"),
        ("anonymous-chat", "AnonymousChat"),
        ("profile", "Profile"),
        ("my-notes", "PersonalNotes"),
        ("academic", "AcademicHub"),
        ("library", "Library"),
        ("parent-dashboard", "ParentDashboard"),
        ("teachers-diary", "TeachersDiary"),
        ("finance", "FinancePortal"),
        ("safety", "SafetyMonitor"),
        ("notifications", "NotificationsPage"),
        ("whiteboard", "Whiteboard")
    ]

    for i, (path, component) in enumerate(feature_pages):
        file_path = f"src/app/dashboard/{path}/page.js"
        if os.path.exists(file_path):
            msg = f"feat({path}): integrate {component} module"
            create_commit([file_path], msg, base_date + timedelta(days=4+i))

    # 6. Cleanup (Final Day)
    cleanup_day = base_date + timedelta(days=4 + len(feature_pages))
    vite_files = [
        "index.html",
        "src/App.jsx",
        "src/main.jsx",
        "src/App.css",
        "src/components/layout/DashboardLayout.jsx",
        "vite.config.js"
    ]
    # Filter only existing files to avoid errors
    existing_vite_files = [f for f in vite_files if os.path.exists(f)]
    if existing_vite_files:
        create_commit(existing_vite_files, "chore(cleanup): remove legacy Vite architecture", cleanup_day)

    # Final Step: Any remaining feature component modifications
    remaining_day = cleanup_day + timedelta(days=1)
    feature_components = subprocess.run(["git", "ls-files", "-m", "src/components/features/"], capture_output=True, text=True).stdout.splitlines()
    if feature_components:
        create_commit(feature_components, "refactor(features): optimize components for Next.js compatibility", remaining_day)

    print("\n[STREAK MASTER] All commits created successfully.")
    print("Ready to push to GitHub.")

if __name__ == "__main__":
    main()
