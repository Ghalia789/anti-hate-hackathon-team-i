# Contributing to Anti-Hate Speech Detection Platform

## Code of Conduct
Be respectful, inclusive, and constructive. We're building a tool to combat hate speech - let's model positive behavior.

## Privacy-First Development

**CRITICAL**: This project is GDPR-compliant by design. All contributions MUST maintain:

1. ✅ No data storage
2. ✅ No cookies or localStorage
3. ✅ Stateless architecture
4. ✅ In-memory processing only

**Before submitting ANY code**, verify:
```bash
# No database usage
grep -r "SQLAlchemy\|pymongo\|redis" backend/

# No localStorage
grep -r "localStorage\|sessionStorage" frontend/

# No cookies
grep -r "set_cookie\|Cookie" backend/
```

## Development Setup

1. Fork the repository
2. Clone your fork
3. Run `./setup.sh`
4. Create a feature branch

## Making Changes

### 1. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes
- Keep changes focused and minimal
- Maintain privacy principles
- Add comments where helpful
- Follow existing code style

### 3. Test Locally
```bash
# Test backend
cd backend
source venv/bin/activate
python app.py

# Test frontend
cd frontend
npm run dev
```

### 4. Verify Privacy Compliance
- Open browser DevTools
- Check Application tab - no cookies, no storage
- Check Network tab - no session headers
- Test that requests are independent

### 5. Commit
```bash
git add .
git commit -m "feat: clear description of changes"
```

Use conventional commits:
- `feat:` - new feature
- `fix:` - bug fix
- `docs:` - documentation
- `style:` - formatting
- `refactor:` - code restructure
- `test:` - add tests
- `chore:` - maintenance

### 6. Push and Create PR
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Pull Request Guidelines

### PR Title
Use conventional commit format:
```
feat: add batch processing endpoint
fix: handle empty text input
docs: update API documentation
```

### PR Description
Include:
```markdown
## Changes
- Describe what you changed
- Why you made the change

## Testing
- How you tested the changes
- Screenshots if UI changes

## Privacy Verification
- [ ] No data storage added
- [ ] No cookies/localStorage used
- [ ] Stateless design maintained
- [ ] GDPR compliance verified

## Checklist
- [ ] Code tested locally
- [ ] Documentation updated
- [ ] Privacy principles maintained
- [ ] No breaking changes (or documented)
```

## Code Review Process

PRs will be reviewed for:

1. **Privacy Compliance** (highest priority)
   - No data persistence
   - Stateless design
   - No tracking

2. **Code Quality**
   - Readable and maintainable
   - Follows existing patterns
   - Proper error handling

3. **Functionality**
   - Works as intended
   - No regressions
   - Edge cases handled

4. **Documentation**
   - Code comments where needed
   - README updated if necessary
   - API changes documented

## Areas for Contribution

### High Priority
- [ ] UI/UX improvements
- [ ] Better error messages
- [ ] Performance optimization
- [ ] Accessibility features
- [ ] Mobile responsiveness
- [ ] Additional language support

### Medium Priority
- [ ] Unit tests
- [ ] Integration tests
- [ ] CI/CD pipeline
- [ ] Documentation improvements
- [ ] Example use cases

### Low Priority
- [ ] Alternative ML models
- [ ] Batch processing UI
- [ ] Export functionality (non-persistent)
- [ ] Keyboard shortcuts
- [ ] Dark mode

## What NOT to Add

❌ **Do NOT contribute:**
- Database integration
- User authentication/accounts
- Session management
- Data logging/analytics
- Persistent storage of any kind
- Cookies or localStorage usage
- User tracking features
- Rate limiting with storage
- Caching with persistence

## Coding Standards

### Python (Backend)
- Follow PEP 8
- Use type hints where helpful
- Keep functions small and focused
- Add docstrings for public functions

```python
def analyze_text(text: str) -> dict:
    """
    Analyze text for hate speech.
    
    Args:
        text: Input text to analyze
        
    Returns:
        Analysis results dictionary
        
    Note: Stateless - no data stored
    """
```

### JavaScript (Frontend)
- Use modern ES6+ syntax
- Prefer functional components
- Use meaningful variable names
- Add comments for complex logic

```javascript
// GOOD
const analyzeText = async (text) => {
  // Process in-memory only - GDPR compliant
  const response = await api.analyzeText(text);
  return response;
};

// BAD - never do this
const saveToLocalStorage = (data) => {
  localStorage.setItem('results', data); // ❌ Privacy violation
};
```

### CSS
- Use semantic class names
- Keep specificity low
- Prefer flexbox/grid
- Mobile-first approach

## Testing

### Manual Testing
1. Run both frontend and backend
2. Test all user flows
3. Check browser console for errors
4. Verify privacy compliance

### Automated Testing
(To be added - contributions welcome!)

## Documentation

Update docs when you:
- Add new features
- Change APIs
- Modify architecture
- Update dependencies

Documentation files:
- `README.md` - main documentation
- `docs/GDPR_COMPLIANCE.md` - privacy details
- `docs/STATELESS_ARCHITECTURE.md` - architecture
- `docs/QUICK_START.md` - hackathon guide

## Questions?

- Check existing documentation
- Open an issue for discussion
- Ask in pull request comments

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing! 🙏
