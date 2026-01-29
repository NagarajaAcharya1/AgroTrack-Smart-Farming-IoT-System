$currentDir = Get-Location

Write-Host "Starting Agricultural Field Monitoring System..." -ForegroundColor Green

# Start Backend
Write-Host "Launching Backend Server on Port 5000..."
Start-Process powershell -ArgumentList "cd backend; npm run dev" -WindowStyle Minimized

# Start Frontend
Write-Host "Launching Frontend Server..."
Start-Process powershell -ArgumentList "cd frontend; npm run dev" -WindowStyle Normal

Write-Host "System Started! Access the dashboard at http://localhost:5173" -ForegroundColor Cyan
