# Supabase Magic Link Template

Use this for the Supabase Auth Magic Link template. The app sends `redirect_to` as `/unlock?session_id=...`, so the CTA should link to `{{ .ConfirmationURL }}`.

## Subject

```text
Your mirror is ready.
```

If the Supabase template has access to a first-name variable, use:

```text
{{ .Data.first_name }}, your mirror is ready.
```

## Body

```html
<p>Hey,</p>

<p>
  Both of your friends have responded. Your dating mirror is ready, and it is
  more specific than most people expect.
</p>

<div style="border:1px solid #d4d4d4;border-radius:8px;padding:16px;margin:20px 0;background:#f7f7f7;">
  <p style="margin:0 0 8px;text-transform:uppercase;letter-spacing:0.16em;font-size:12px;color:#777;">
    A first look
  </p>
  <p style="margin:0;font-style:italic;">
    You want peace. You keep responding to fire. Your friends have noticed this longer than you have.
  </p>
</div>

<p>
  The full mirror, including who you attract, what calms you, what activates you,
  and your gap, is waiting for you.
</p>

<p>
  <a
    href="{{ .ConfirmationURL }}"
    style="display:block;background:#111;color:#fff;text-decoration:none;text-align:center;border-radius:8px;padding:14px 18px;font-weight:600;"
  >
    See my full mirror
  </a>
</p>

<p style="font-size:13px;color:#666;text-align:center;">
  This link opens your private result screen. Set a password there; your report stays private and only you can see it.
</p>

<hr style="border:none;border-top:1px solid #e6e6e6;margin:24px 0;" />

<p style="font-size:13px;color:#666;">
  Your friends' individual responses are never shown to you. You see only the aggregate signal.
  Results are private by default; you choose if and what to share.
</p>
```
