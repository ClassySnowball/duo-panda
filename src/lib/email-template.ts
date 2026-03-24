interface EmailData {
  displayName: string;
  compliment: string;
  totalCardsReviewed: number;
  totalWordsLearned: number;
  currentStreak: number;
  dueCards: number;
}

export function buildDailyEmail(data: EmailData): string {
  const { displayName, compliment, totalCardsReviewed, totalWordsLearned, currentStreak, dueCards } = data;
  const name = displayName || 'there';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background-color:#FAF6F1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:440px;margin:0 auto;padding:32px 20px;">
    <div style="text-align:center;margin-bottom:24px;">
      <div style="font-size:48px;margin-bottom:8px;">🐼</div>
      <h1 style="color:#4A7C59;font-size:24px;margin:0;">Duo Panda</h1>
    </div>

    <div style="background:white;border-radius:16px;padding:24px;margin-bottom:20px;border:1px solid #E8E2D9;">
      <p style="color:#5C5549;font-size:16px;margin:0 0 4px;">Hey ${name}! 👋</p>
      <p style="color:#4A7C59;font-size:18px;font-weight:600;margin:0;line-height:1.4;">
        ${compliment}
      </p>
    </div>

    <div style="display:flex;gap:12px;margin-bottom:20px;">
      <div style="flex:1;background:white;border-radius:12px;padding:16px;text-align:center;border:1px solid #E8E2D9;">
        <div style="color:#4A7C59;font-size:24px;font-weight:700;">${totalCardsReviewed}</div>
        <div style="color:#9C9588;font-size:12px;">Cards Reviewed</div>
      </div>
      <div style="flex:1;background:white;border-radius:12px;padding:16px;text-align:center;border:1px solid #E8E2D9;">
        <div style="color:#4A7C59;font-size:24px;font-weight:700;">${totalWordsLearned}</div>
        <div style="color:#9C9588;font-size:12px;">Words Learned</div>
      </div>
      <div style="flex:1;background:white;border-radius:12px;padding:16px;text-align:center;border:1px solid #E8E2D9;">
        <div style="color:#4A7C59;font-size:24px;font-weight:700;">${currentStreak}🔥</div>
        <div style="color:#9C9588;font-size:12px;">Day Streak</div>
      </div>
    </div>

    ${dueCards > 0 ? `
    <div style="background:white;border-radius:12px;padding:16px;margin-bottom:20px;text-align:center;border:1px solid #E8E2D9;">
      <p style="color:#5C5549;font-size:14px;margin:0;">
        You have <strong style="color:#4A7C59;">${dueCards} cards</strong> waiting for review tonight!
      </p>
    </div>
    ` : ''}

    <div style="text-align:center;">
      <a href="https://duopanda.vercel.app/dashboard"
         style="display:inline-block;background:#4A7C59;color:white;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:600;font-size:16px;">
        Open Duo Panda
      </a>
    </div>

    <p style="text-align:center;color:#C4BEB6;font-size:11px;margin-top:32px;">
      Your daily panda update from Duo Panda 🐼
    </p>
  </div>
</body>
</html>`;
}
