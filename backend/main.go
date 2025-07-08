package main

import (
	"log"
	"regexp"

	"github.com/gofiber/fiber/v2"
)

type Control struct {
	ControlID   string `json:"controlId"`
	Category    string `json:"category"`
	Description string `json:"description"`
}

var controls []Control

func main() {
	app := fiber.New()

	app.Post("/submit", func(c *fiber.Ctx) error {
		var control Control
		if err := c.BodyParser(&control); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
		}

		if control.ControlID == "" || control.Category == "" || control.Description == "" {
			return c.Status(400).JSON(fiber.Map{"error": "All fields are required"})
		}
		var controlIdRegex = regexp.MustCompile(`^CTRL-\d{3}$`)
		if !controlIdRegex.MatchString(control.ControlID) {
			return c.Status(400).JSON(fiber.Map{"error": "Control ID must be format CTRL-XXX"})
		}
		if len(control.Description) < 10 || len(control.Description) > 500 {
			return c.Status(400).JSON(fiber.Map{"error": "Description must be 10-500 characters"})
		}
		validCategories := map[string]bool{
			"Access Control":  true,
			"Data Protection": true,
			"Monitoring":      true,
		}
		if !validCategories[control.Category] {
			return c.Status(400).JSON(fiber.Map{"error": "Invalid Category"})
		}

		controls = append(controls, control)
		return c.JSON(fiber.Map{"message": "Submission successful", "control": control})
	})

	if err := app.Listen(":3000"); err != nil {
		log.Fatal(err)
	}
}
