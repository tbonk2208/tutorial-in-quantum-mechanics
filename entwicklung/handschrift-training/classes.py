"""Klassenliste (DESIGN.md + '†' laut Hauptsitzung) und Zuordnung der Quellnamen."""
CLASSES = (list('0123456789') + list('abcdefghijklmnpqrstuvwxyz') + list('ABCDEFHLMNPRSTV')
           + list('αβγδεθκλμνξπρστφχψω') + list('ΔΦΨΩ')
           + ['+', '-', '=', '(', ')', '[', ']', '{', '}', '|', ',', '.', "'", '!', '/', 'sqrt', 'pm',
              '∫', 'Σ', '∂', '∞', 'ħ', '∇', '⟨', '⟩', '↑', '↓', '⊗', '*', '†'])
assert len(CLASSES) == len(set(CLASSES))

_COMMON = {c: c for c in CLASSES if len(c) == 1 and c.isascii()}
_COMMON.update({'\\{': '{', '\\}': '}', '\\alpha': 'α', '\\beta': 'β', '\\gamma': 'γ', '\\delta': 'δ',
                '\\theta': 'θ', '\\vartheta': 'θ', '\\kappa': 'κ', '\\varkappa': 'κ', '\\lambda': 'λ',
                '\\mu': 'μ', '\\nu': 'ν', '\\xi': 'ξ', '\\pi': 'π', '\\rho': 'ρ', '\\varrho': 'ρ',
                '\\sigma': 'σ', '\\tau': 'τ', '\\phi': 'φ', '\\varphi': 'φ', '\\chi': 'χ', '\\psi': 'ψ',
                '\\omega': 'ω', '\\epsilon': 'ε', '\\varepsilon': 'ε', '\\Delta': 'Δ', '\\Phi': 'Φ',
                '\\Psi': 'Ψ', '\\Omega': 'Ω', '\\sum': 'Σ', '\\Sigma': 'Σ', '\\int': '∫', '\\infty': '∞',
                '\\partial': '∂', '\\hbar': 'ħ', '\\nabla': '∇', '\\uparrow': '↑', '\\downarrow': '↓',
                '\\otimes': '⊗', '\\ast': '*', '\\dag': '†', '\\pm': 'pm', '\\sqrt': 'sqrt', '\\sqrt{}': 'sqrt',
                '\\langle': '⟨', '\\rangle': '⟩', '<': '⟨', '>': '⟩', '\\lt': '⟨', '\\gt': '⟩',
                '\\mid': '|', '\\prime': "'", '\\cdot': '.'})
# 'o', 'O' (Verwechslung mit 0) und alles andere: keine Klasse
for k in ('o', 'O'):
    _COMMON.pop(k, None)


def map_label(lab):
    return _COMMON.get(lab)
