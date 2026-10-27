# inflow2036

All-in-one personal finance, habits, productivity, and ERP workspace ported from Google Apps Script to a modern React + TypeScript + Tailwind CSS application.

---

## 🚀 ಗಿಟ್ ಹಬ್ ಗೆ ಪುಶ್ ಮಾಡುವುದು ಹೇಗೆ (How to Push to GitHub)

ಈ ಕೋಡ್ ಅನ್ನು ನಿಮ್ಮ GitHub ಅಕೌಂಟ್‌ಗೆ ಪುಶ್ ಮಾಡಲು ಈ ಕೆಳಗಿನ ಸರಳ ಹಂತಗಳನ್ನು ಅನುಸರಿಸಿ:

1. **GitHub ನಲ್ಲಿ ಹೊಸ Repository ಕ್ರಿಯೇಟ್ ಮಾಡಿ:**
   - [GitHub](https://github.com/new) ಗೆ ಹೋಗಿ `inflow2036` ಹೆಸರಿನ ಹೊಸ ಖಾಲಿ Repository ಕ್ರಿಯೇಟ್ ಮಾಡಿ (README ಅಥವಾ .gitignore ಸೇರಿಸಬೇಡಿ).

2. **ನಿಮ್ಮ ಟರ್ಮಿನಲ್‌ನಲ್ಲಿ ಈ ಕಮಾಂಡ್‌ಗಳನ್ನು ರನ್ ಮಾಡಿ:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit of inflow2036 web application"
   git branch -M main
   git remote add origin https://github.com/<ನಿಮ್ಮ-ಯೂಸರ್-ನೇಮ್>/inflow2036.git
   git push -u origin main
   ```

3. **ಮುಂದಿನ ದಿನಗಳಲ್ಲಿ ಕೋಡ್ ಅಪ್ಡೇಟ್ ಮಾಡುವಾಗ:**
   ```bash
   git add .
   git commit -m "Update feature or data"
   git push
   ```

---

## 💻 ಸ್ಥಳೀಯವಾಗಿ ರನ್ ಮಾಡುವುದು (Local Development)

```bash
# ಡಿಪೆಂಡೆನ್ಸಿ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ
npm install

# ಡೆವಲಪ್‌ಮೆಂಟ್ ಸರ್ವರ್ ಚಲಾಯಿಸಿ (Port 3000)
npm run dev

# ಪ್ರೊಡಕ್ಷನ್ ಬಿಲ್ಡ್
npm run build
```

---

## 🌟 ಒಳಗೊಂಡಿರುವ 15 ಮಾಡ್ಯೂಲ್‌ಗಳು (Included Modules & Logic)

1. **🔒 Password Lock Screen**: ಡಿಫಾಲ್ಟ್ ಪಾಸ್‌ವರ್ಡ್: `shanu2`. ಸೆಶನ್ ಮುಗಿಯುವವರೆಗೆ ಅನ್‌ಲಾಕ್ ಆಗಿರುತ್ತದೆ.
2. **🏃 Run Walk**: ದೈನಂದಿನ KM Quick Edit, ವಾರದ, ತಿಂಗಳ ಮತ್ತು ವಾರ್ಷಿಕ ಸರಾಸರಿಗಳು, 7 ದಿನಗಳ ಇತಿಹಾಸ ಮತ್ತು ತಿದ್ದುಪಡಿ.
3. **✓ Habit Tracker**: ದಿನನಿತ್ಯದ ಚಟುವಟಿಕೆಗಳ 7 ದಿನಗಳ ಟೇಬಲ್, ಒಂದು ಟ್ಯಾಪ್‌ನಲ್ಲಿ ✅ / ❌ / Empty ಟಾಗಲ್.
4. **📝 Quick Note**: ಆಟೋ-ಸೇವ್ ಆಗುವ ನೋಟ್ ಕಾರ್ಡ್‌ಗಳು ಮತ್ತು ಟೈಮ್‌ಸ್ಟ್ಯಾಂಪ್.
5. **📓 Diary**: ದಿನಾಂಕ ಮತ್ತು ಶೀರ್ಷಿಕೆ ಹೊಂದಿರುವ ಪೂರ್ಣ ಜರ್ನಲ್ ಸ್ಟೋರಿ ಮತ್ತು ಎಡಿಟ್/ಡಿಲೀಟ್ ಸೌಲಭ್ಯ.
6. **📌 Liability & Liquid Assets**: ಒಟ್ಟು ಆಸ್ತಿ (Assets), ಒಟ್ಟು ಸಾಲ (Liabilities) ಮತ್ತು Net Worth ಲೆಕ್ಕಾಚಾರ.
7. **🏛️ Saving Bank**: INR (₹) ಮತ್ತು AED ಕರೆನ್ಸಿ ಬ್ಯಾಲೆನ್ಸ್, ಬ್ಯಾಂಕ್ ಖಾತೆಗಳು, ವಾಲೆಟ್ ನಿರ್ವಹಣೆ.
8. **💳 Salary Card**: 12 ತಿಂಗಳ ಸ್ಯಾಲರಿ ಕಾರ್ಡ್, Basic + Allowance + OT = Total AED, ಲೈವ್ 1 AED = ₹ ಕನ್ವರ್ಶನ್ ದರದಲ್ಲಿ Total INR ಲೆಕ್ಕಾಚಾರ.
9. **🪣 Bucket List**: ಭಾರತ (India), ಯುಎಇ (UAE) ಮತ್ತು ಎಲ್ಲಾ ದೇಶಗಳ ಸ್ಥಳಗಳು, ಫೋಟೋ, ಗೂಗಲ್ ಮ್ಯಾಪ್ ಲಿಂಕ್, ರೇಟಿಂಗ್ (⭐⭐⭐⭐⭐).
10. **📅 Planning**: ಪ್ರಯಾಣ, ಮದುವೆ ಅಥವಾ ಬಜೆಟ್ ಪ್ಲಾನಿಂಗ್, Income ಮತ್ತು Expense ಚಾರ್ಟ್, ಚೆಕ್‌ಲಿಸ್ಟ್ (Done/Pending) ಮತ್ತು Net Balance.
11. **🎨 Graphic Zone (Studio ERP)**: ಜಾಬ್ ಶೀಟ್ (G315...), ಇನ್‌ವಾಯ್ಸ್ (Invoice Bill) ರಚನೆ, ಡೌನ್‌ಲೋಡ್ JPG, ನೇರ WhatsApp ಶೇರ್, ₹3 ಲಕ್ಷ ಟಾರ್ಗೆಟ್ ಪಾಯಿಂಟ್ಸ್, ಮತ್ತು ಕಸ್ಟಮರ್ ಡೈರೆಕ್ಟರಿ.
12. **❤️ Health**: ದೈನಂದಿನ ನೀರು (Liters), ನಿದ್ರೆ (Hours), ವ್ಯಾಯಾಮ (Minutes) ಮತ್ತು ತೂಕ (Kg) ಲಾಗ್.
13. **📈 inflow2036**: Core Fund, Mutual Funds ಮತ್ತು Stocks ಪೋರ್ಟ್‌ಫೋಲಿಯೊ, ಹೂಡಿಕೆ ಹಾಗೂ ಲಾಭ/ನಷ್ಟ ವಿಶ್ಲೇಷಣೆ.
14. **📊 5% Club**: ಟ್ರೇಡಿಂಗ್ ಜರ್ನಲ್, ಹೋಲ್ಡಿಂಗ್ ದಿನಗಳು, ನೆಟ್ P&L, ಬ್ರೋಕರ್ ಚಾರ್ಜ್‌ಗಳು ಮತ್ತು Python Market Scanner (Supertrend, ADX).
15. **🗣️ Skill Improve**: 104 ಕನ್ನಡ ವಾಕ್ಯಗಳಿಗೆ ಹಿಂದಿ ಅನುವಾದ, Roman & Devanagari ಲಿಪಿ, ಹಾಗೂ ಸ್ಪಷ್ಟವಾದ **ಧ್ವನಿ ಉಚ್ಚಾರಣೆ (Speech Synthesis Voice)**!
16. **🎂 Special Days**: ಹುಟ್ಟುಹಬ್ಬ, ವಾರ್ಷಿಕೋತ್ಸವಗಳ ದಿನಗಳ ಕೌಂಟ್‌ಡೌನ್ (ಉದಾ: "🔥 Today!", "3 days left") ಮತ್ತು ನೇರ WhatsApp Wish ಬಟನ್.

---

## ☁️ Backup & Data Sync

- ಅಪ್ಲಿಕೇಶನ್‌ನ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ನಲ್ಲಿರುವ **"☁️ Backup & Sync"** ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ ನಿಮ್ಮ ಸಂಪೂರ್ಣ ಡೇಟಾವನ್ನು ಒಂದೇ ಕ್ಲಿಕ್‌ನಲ್ಲಿ JSON ಫೈಲ್ ಆಗಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿಕೊಳ್ಳಬಹುದು.
- ಯಾವುದೇ ಕಂಪ್ಯೂಟರ್ ಅಥವಾ ಮೊಬೈಲ್‌ನಲ್ಲಿ ಆ JSON ಫೈಲ್ ಅಪ್ಲೋಡ್ ಮಾಡಿ ಡೇಟಾವನ್ನು ಪುನಃ ಪಡೆದುಕೊಳ್ಳಬಹುದು (Restore).
